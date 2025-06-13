import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import axios from 'axios';
import { DataSource } from 'typeorm';

interface TurnoRecord {
    id: number;
    token_notification: string;
    nombre: string;
    negocio: string;
    fecha: string; // 2025-06-09 17:00:00
}

@Injectable()
export class NotificacionesService {
    constructor(private dataSource: DataSource) {
        // ⏰ Aviso 1 día antes a las 11:00 AM
        cron.schedule('0 11 * * *', () => this.enviarRecordatoriosUnDiaAntes());

        // ⏰ Aviso 1 hora antes, ejecuta cada 10 minutos
        cron.schedule('*/10 * * * *', () => this.enviarRecordatoriosUnaHoraAntes());
    }

    private async enviarRecordatoriosUnDiaAntes() {
        const query = `
            SELECT t.id, u.token_notification, u.nombre, n.nombre AS negocio, t.fecha
            FROM turnos t
            JOIN usuarios u ON u.id = t.id_usuario
            JOIN datos_negocios n ON n.id = t.id_dato_negocio
            WHERE DATE(t.fecha) = CURDATE() + INTERVAL 1 DAY
              AND t.estado = 0
              AND t.notificado_1d = 0
              AND u.token_notification IS NOT NULL
              AND u.enabled_notification = 1
        `;

        const turnos: TurnoRecord[] = await this.dataSource.query(query);

        for (const t of turnos) {
            await this.pushExpo(t.token_notification, {
                title: '📅 Recordatorio',
                body: `Hola ${t.nombre}, mañana tenés turno en ${t.negocio}`,
            });

            await this.dataSource.query(`UPDATE turnos SET notificado_1d = 1 WHERE id = ?`, [t.id]);
        }

        console.log(`✅ Notificaciones de 1 día antes: ${turnos.length}`);
    }

    private async enviarRecordatoriosUnaHoraAntes() {
        const query = `
            SELECT t.id, u.token_notification, u.nombre, n.nombre AS negocio, t.fecha
            FROM turnos t
            JOIN usuarios u ON u.id = t.id_usuario
            JOIN datos_negocios n ON n.id = t.id_dato_negocio
            WHERE t.fecha BETWEEN NOW() AND NOW() + INTERVAL 1 HOUR
              AND t.estado = 0
              AND t.notificado_1h = 0
              AND u.token_notification IS NOT NULL
              AND u.enabled_notification = 1
        `;

        const turnos: TurnoRecord[] = await this.dataSource.query(query);

        for (const t of turnos) {
            await this.pushExpo(t.token_notification, {
                title: '⏰ ¡Tu turno es pronto!',
                body: `Hola ${t.nombre}, tu turno en ${t.negocio} es dentro de 1 hora.`,
            });

            await this.dataSource.query(`UPDATE turnos SET notificado_1h = 1 WHERE id = ?`, [t.id]);
        }

        console.log(`✅ Notificaciones de 1 hora antes: ${turnos.length}`);
    }

    private async pushExpo(to: string, msg: { title: string; body: string }) {
        try {
            await axios.post('https://exp.host/--/api/v2/push/send', {
                to,
                sound: 'default',
                title: msg.title,
                body: msg.body,
            });
        } catch (err) {
            console.error('❌ Error enviando push:', err.message);
        }
    }
}
