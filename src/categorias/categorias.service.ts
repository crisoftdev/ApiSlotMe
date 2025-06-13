import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class CategoriasService {
    constructor(private readonly dataSource: DataSource) { }

    async obtenerCategorias() {
        const query = 'SELECT * FROM categorias';
        return await this.dataSource.query(query);
    }

    async obtenerNegociosPorCategoria(idCategoria: number, userId: number) {
        const query = `
        SELECT 
            dn.*, 
            IF(f.id IS NOT NULL, 1, 0) AS favorito, dn.id AS id_dato_negocio
        FROM datos_negocios dn
        LEFT JOIN favoritos f ON f.id_dato_negocio = dn.id AND f.id_usuario = ?
        WHERE dn.id_categoria = ?
        `;
        return await this.dataSource.query(query, [userId, idCategoria]);
    }
}
