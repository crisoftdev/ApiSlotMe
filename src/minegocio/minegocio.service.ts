import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MinegocioService {
    constructor(private readonly dataSource: DataSource) { }

    async obtenerNegocio(userId: number) {
        const categorias = `SELECT * FROM categorias WHERE estado=0`;

        const diasTurnosQuery = `
      SELECT * 
      FROM datos_negocios 
      LEFT JOIN dias_turnos ON dias_turnos.id_dato_negocio=datos_negocios.id
      LEFT JOIN rangos_horarios ON rangos_horarios.id_dia_turnos=dias_turnos.id
      WHERE id_usuario = ?`;

        const imagenes = `
      SELECT imagenes_negocio.* 
      FROM imagenes_negocio
      JOIN datos_negocios ON datos_negocios.id=imagenes_negocio.id_negocio
      WHERE datos_negocios.id_usuario=?`;

        const catego = await this.dataSource.query(categorias);
        const diasTurnos = await this.dataSource.query(diasTurnosQuery, [userId]);
        const img = await this.dataSource.query(imagenes, [userId]);

        return {
            categorias: catego || null,
            datos: diasTurnos,
            imagenes: img,
        };
    }

    async guardarNegocio(userId: number, body: any) {
        const {
            id_categoria,
            nombre,
            logo,
            banner,
            intervalo,
            intervaloReserva,
            direccion,
            detalle,
            dias,
            imagenesNuevas,
            imagenesEliminadas,
        } = body;

        await this.dataSource.query(
            `
      INSERT INTO datos_negocios 
        (id_usuario, id_categoria, nombre, logo, banner, intervalo_hora, intervalo_reserva, direccion, detalle)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        id_categoria = VALUES(id_categoria),
        nombre = VALUES(nombre),
        logo = VALUES(logo),
        banner = VALUES(banner),
        intervalo_hora = VALUES(intervalo_hora),
        intervalo_reserva = VALUES(intervalo_reserva),
        direccion = VALUES(direccion),
        detalle = VALUES(detalle)
      `,
            [userId, id_categoria, nombre, logo, banner, intervalo, intervaloReserva, direccion, detalle]
        );

        const [negocio] = await this.dataSource.query(
            `SELECT id FROM datos_negocios WHERE id_usuario = ?`,
            [userId]
        );
        const id_dato_negocio = negocio?.id;
        if (!id_dato_negocio) throw new Error("Negocio no encontrado");

        // 🔁 Eliminar días y rangos anteriores
        await this.dataSource.query(
            `DELETE rh FROM rangos_horarios rh
       JOIN dias_turnos dt ON rh.id_dia_turnos = dt.id
       WHERE dt.id_dato_negocio = ?`,
            [id_dato_negocio]
        );

        await this.dataSource.query(
            `DELETE FROM dias_turnos WHERE id_dato_negocio = ?`,
            [id_dato_negocio]
        );

        // 🟩 Insertar días y horarios nuevos
        for (const dia of dias) {
            const res: any = await this.dataSource.query(
                `INSERT INTO dias_turnos (id_dato_negocio, dia) VALUES (?, ?)`,
                [id_dato_negocio, dia.dia]
            );
            const insertId = res?.insertId;

            await this.dataSource.query(
                `INSERT INTO rangos_horarios (id_dia_turnos, hora_inicio, hora_fin) VALUES (?, ?, ?)`,
                [insertId, dia.hora_inicio, dia.hora_fin]
            );
        }

        // ✅ Guardar imágenes nuevas (si no existen)
        if (imagenesNuevas && imagenesNuevas.length) {
            for (const img of imagenesNuevas) {
                const existe = await this.dataSource.query(
                    `SELECT id FROM imagenes_negocio WHERE id_negocio = ? AND url = ?`,
                    [id_dato_negocio, img]
                );
                if (existe.length === 0) {
                    await this.dataSource.query(
                        `INSERT INTO imagenes_negocio (id_negocio, url) VALUES (?, ?)`,
                        [id_dato_negocio, img]
                    );
                }
            }
        }

        // ❌ Eliminar imágenes quitadas
        if (imagenesEliminadas && imagenesEliminadas.length) {
            for (const img of imagenesEliminadas) {
                await this.dataSource.query(
                    `DELETE FROM imagenes_negocio WHERE id_negocio = ? AND url = ?`,
                    [id_dato_negocio, img]
                );
            }
        }

        return { success: true };
    }
}
