// src/home/home.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Home } from './home.entity';

@Injectable()
export class HomeService {
    constructor(@InjectRepository(Home) private repo: Repository<Home>) { }

    async findAll(userId: string) {
        const turnos = await this.repo.query(
            `SELECT turnos.id, turnos.fecha, datos_negocios.nombre, datos_negocios.direccion, datos_negocios.detalle, datos_negocios.logo  
FROM turnos 
JOIN datos_negocios ON datos_negocios.id=turnos.id_dato_negocio
WHERE turnos.id_usuario=? AND turnos.fecha >= CURDATE()
ORDER BY fecha `,
            [userId]
        );

        const promociones = await this.repo.query(
            `SELECT 
  promociones.*, 
  datos_negocios.nombre, 
  datos_negocios.detalle, 
  datos_negocios.banner, 
  FORMAT(AVG(rating.estrella), 1) AS rating_promedio
FROM promociones
JOIN datos_negocios ON datos_negocios.id = promociones.id_negocio
LEFT JOIN rating ON rating.id_negocio = datos_negocios.id
GROUP BY 
  promociones.id, 
  datos_negocios.id`,
        );

        const favoritos = await this.repo.query(
            `SELECT favoritos.id, datos_negocios.nombre, datos_negocios.banner,
ifnull(FORMAT(AVG(rating.estrella), 1),'Sin Calificaciones') AS rating_promedio
FROM favoritos
JOIN datos_negocios ON datos_negocios.id=favoritos.id_dato_negocio
LEFT JOIN rating ON rating.id_negocio = datos_negocios.id
WHERE favoritos.id_usuario=  ?
GROUP BY 
  favoritos.id, 
  datos_negocios.id`,
            [userId] 
        );

        return {
            turnos,
            promociones,
            favoritos
        };
    }
}
