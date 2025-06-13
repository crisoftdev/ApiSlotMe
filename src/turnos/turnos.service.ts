import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class TurnosService {
    constructor(private dataSource: DataSource) { }

    async create(turno: {
        fechaDesde: string;
        fechaHasta: string;
        idNegocio: number;
        userId: number;
    }) {
        const idGrupo = crypto.randomUUID(); // opcional, si seguís agrupando

        await this.dataSource.query(
            `INSERT INTO turnos (fecha, fecha_hasta, id_dato_negocio, id_usuario, id_turno_grupo)
     VALUES (?, ?, ?, ?, ?)`,
            [turno.fechaDesde, turno.fechaHasta, turno.idNegocio, turno.userId, idGrupo]
        );

        return { message: 'Turno creado correctamente', idGrupo };
    }


    async update(
        id: number,
        datos: Partial<{ fechaDesde: string; fechaHasta: string; idNegocio: number }>,
        userId: number
    ) {
        const campos: string[] = [];
        const valores: any[] = [];

        if (datos.fechaDesde) {
            campos.push('fecha = ?');
            valores.push(datos.fechaDesde);
        }
        if (datos.idNegocio) {
            campos.push('id_dato_negocio = ?');
            valores.push(datos.idNegocio);
        }

        if (campos.length === 0) return { message: 'Nada para actualizar' };

        const query = `
      UPDATE turnos
      SET fecha= ? , fecha_hasta = ?
      WHERE id = ? AND id_usuario = ?
    `;
        const result = await this.dataSource.query(query, [datos.fechaDesde, datos.fechaHasta, id, userId]);
        return { message: 'Turno actualizado correctamente', result };
    }

    async delete(id: number, userId: number) {
        const query = `UPDATE turnos SET estado=2 WHERE id = ? AND id_usuario = ?`;
        await this.dataSource.query(query, [id, userId]);
        return { message: 'Turno eliminado correctamente' };
    }

    async findAll(idUsuario: number) {
        const query = `SELECT * FROM turnos WHERE id_usuario = ? ORDER BY fecha_hora ASC`;
        const result = await this.dataSource.query(query, [idUsuario]);
        return result;
    }
}
