import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class FavoritosService {
    constructor(
        @InjectConnection() private readonly connection: Connection,
    ) { }

    async toggleFavorito(id_usuario: number, id_dato_negocio: number) {
        console.log("id_usuario:", id_usuario)
        console.log("id_dato_negocio:", id_dato_negocio)
        const [existe] = await this.connection.query(
            'SELECT id FROM favoritos WHERE id_usuario = ? AND id_dato_negocio = ?',
            [id_usuario, id_dato_negocio],
        );

        if (existe) {
            await this.connection.query(
                'DELETE FROM favoritos WHERE id_usuario = ? AND id_dato_negocio = ?',
                [id_usuario, id_dato_negocio],
            );
            return { mensaje: 'Eliminado de favoritos', favorito: 0 };
        } else {
            await this.connection.query(
                'INSERT INTO favoritos (id_usuario, id_dato_negocio) VALUES (?, ?)',
                [id_usuario, id_dato_negocio],
            );
            return { mensaje: 'Agregado a favoritos', favorito: 1 };
        }
    }
}
