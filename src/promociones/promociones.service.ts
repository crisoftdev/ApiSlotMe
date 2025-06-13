import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PromocionesService {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }

    async guardarPromocion(data: any, idUsuario: number) {
        const {
            id, // opcional
            tipo,
            valor,
            detalle,
            codigo,
            requiere_codigo,
            fecha_inicio,
            fecha_fin,
            limite_total,
            limite_por_usuario,
        } = data;

        const [negocio] = await this.dataSource.query(
            `SELECT id FROM datos_negocios WHERE id_usuario = ? LIMIT 1`,
            [idUsuario]
        );

        if (!negocio) {
            throw new Error('No se encontró un negocio asociado al usuario.');
        }

        const id_negocio = negocio.id;
        const codigoFinal = codigo || this.generarCodigoAleatorio();

        if (id) {
            // 🔁 Actualizar si viene ID
            await this.dataSource.query(
                `UPDATE promociones SET
          tipo = ?, valor = ?, detalle = ?, codigo = ?, requiere_codigo = ?,
          fecha_inicio = ?, fecha_fin = ?, limite_total = ?, limite_por_usuario = ?
         WHERE id = ? AND id_negocio = ?`,
                [
                    tipo,
                    valor,
                    detalle,
                    codigoFinal,
                    requiere_codigo,
                    fecha_inicio,
                    fecha_fin,
                    limite_total || null,
                    limite_por_usuario || null,
                    id,
                    id_negocio
                ]
            );

            return { message: 'Promoción actualizada correctamente', codigo: codigoFinal };
        } else {
            // 🆕 Insertar si NO viene ID
            await this.dataSource.query(
                `INSERT INTO promociones (
          id_negocio, tipo, valor, detalle, codigo, requiere_codigo,
          fecha_inicio, fecha_fin, limite_total, limite_por_usuario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    id_negocio,
                    tipo,
                    valor,
                    detalle,
                    codigoFinal,
                    requiere_codigo,
                    fecha_inicio,
                    fecha_fin,
                    limite_total || null,
                    limite_por_usuario || null,
                ]
            );

            return { message: 'Promoción creada correctamente', codigo: codigoFinal };
        }
    }

    private generarCodigoAleatorio(longitud: number = 7): string {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let resultado = '';
        for (let i = 0; i < longitud; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
    }

    async obtenerPromociones(idUsuario: number) {
        const [negocio] = await this.dataSource.query(
            `SELECT id FROM datos_negocios WHERE id_usuario = ? LIMIT 1`,
            [idUsuario]
        );

        if (!negocio) {
            throw new Error('No se encontró un negocio asociado al usuario.');
        }

        const id_negocio = negocio.id;

        const promociones = await this.dataSource.query(
            `SELECT * FROM promociones WHERE id_negocio = ? ORDER BY fecha_fin ASC`,
            [id_negocio]
        );

        return promociones;
    }

    async actualizarEstado(idPromo: number, nuevoEstado: number, idUsuario: number) {

        console.log(`idPromo ${idPromo} nuevoEstado ${nuevoEstado} idUsuario ${idUsuario}`)
        // Validar que el usuario sea dueño de la promo
        const [promo] = await this.dataSource.query(
            `SELECT p.id FROM promociones p
     JOIN datos_negocios dn ON p.id_negocio = dn.id
     WHERE p.id = ? AND dn.id_usuario = ? LIMIT 1`,
            [idPromo, idUsuario]
        );

        if (!promo) {
            throw new Error('Promoción no encontrada o no autorizada.');
        }

        await this.dataSource.query(
            `UPDATE promociones SET estado = ? WHERE id = ?`,
            [nuevoEstado, idPromo]
        );

        return { message: 'Estado actualizado', estado: nuevoEstado };
    }

}
