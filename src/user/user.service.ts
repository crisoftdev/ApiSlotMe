import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private dataSource: DataSource) { }

  async findByCuit(usuario: string): Promise<User | null> {
    const result = await this.dataSource.query(
      `SELECT usuarios.*, claves.clave, datos_negocios.nombre AS negocio_nombre, datos_negocios.usuario, datos_negocios.logo, datos_negocios.intervalo_hora,
datos_negocios.direccion, datos_negocios.detalle, datos_negocios.banner 
FROM usuarios 
JOIN claves ON claves.id_usuario=usuarios.id
LEFT JOIN datos_negocios ON datos_negocios.id_usuario=usuarios.id WHERE email = ? LIMIT 1`,
      [usuario],
    );
    return result[0] || null;
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.dataSource.query(
      `SELECT usuarios.*, claves.clave, datos_negocios.nombre AS negocio_nombre, datos_negocios.usuario, datos_negocios.logo, datos_negocios.intervalo_hora,
datos_negocios.direccion, datos_negocios.detalle, datos_negocios.banner 
FROM usuarios 
JOIN claves ON claves.id_usuario=usuarios.id
LEFT JOIN datos_negocios ON datos_negocios.id_usuario=usuarios.id
 WHERE usuarios.id = ? LIMIT 1`,
      [id],
    );
    return result[0] || null;
  }

  async create(usuario: string, password: string): Promise<User> {
    await this.dataSource.query(
      'INSERT INTO usuarios (email, contrasenia) VALUES (?, ?)',
      [usuario, password],
    );

    const result = await this.findByCuit(usuario);
    return result!;
  }
}
