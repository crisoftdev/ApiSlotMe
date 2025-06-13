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
            `SELECT 
  turnos.id, 
  turnos.fecha, 
  datos_negocios.nombre, 
  datos_negocios.direccion, 
  datos_negocios.detalle, 
  datos_negocios.logo, 
  datos_negocios.banner, 
  datos_negocios.id AS id_negocio, 
  turnos.id_turno_grupo, 
  turnos.fecha_hasta,
  CASE 
    WHEN favoritos.id_usuario IS NOT NULL THEN 1
    ELSE 0
  END AS favorito
FROM turnos 
JOIN datos_negocios ON datos_negocios.id = turnos.id_dato_negocio
LEFT JOIN favoritos ON favoritos.id_dato_negocio = datos_negocios.id AND favoritos.id_usuario = ?
WHERE turnos.id_usuario = ?
  AND turnos.fecha >= CURDATE() 
  AND turnos.estado = 0
ORDER BY turnos.fecha;`,
            [userId, userId]
        );

        const promociones = await this.repo.query(
            `SELECT 
  promociones.*, 
  datos_negocios.nombre, 
  datos_negocios.detalle, 
  datos_negocios.banner, 
  datos_negocios.logo, 
  datos_negocios.direccion,
  FORMAT(AVG(rating.estrella), 1) AS rating_promedio, datos_negocios.id AS id_dato_negocio,
  CASE 
    WHEN favoritos.id_usuario IS NOT NULL THEN 1
    ELSE 0
  END AS favorito
FROM promociones
JOIN datos_negocios ON datos_negocios.id = promociones.id_negocio
LEFT JOIN rating ON rating.id_negocio = datos_negocios.id
LEFT JOIN favoritos 
  ON favoritos.id_dato_negocio = datos_negocios.id AND favoritos.id_usuario = ?
  WHERE promociones.estado=0
GROUP BY 
  promociones.id, 
  datos_negocios.id;
`,
            [userId]
        );

        const favoritos = await this.repo.query(
            `SELECT favoritos.id, datos_negocios.nombre, datos_negocios.banner,
ifnull(FORMAT(AVG(rating.estrella), 1),'Sin Calificaciones') AS rating_promedio,  datos_negocios.logo,
datos_negocios.detalle,datos_negocios.direccion, 1 AS favorito, favoritos.id_dato_negocio
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
