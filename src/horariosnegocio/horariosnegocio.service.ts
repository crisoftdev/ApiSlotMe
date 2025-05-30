import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorariosNegocio } from './horariosnegocios.entity';

@Injectable()
export class HorariosnegocioService {
  constructor(@InjectRepository(HorariosNegocio) private repo: Repository<HorariosNegocio>) { }

  async findAll(id: string) {

    const horarios = await this.repo.query(
      `SELECT dias_turnos.dia, rangos_horarios.hora_inicio, rangos_horarios.hora_fin, datos_negocios.intervalo_hora, credenciales_mp.clientId, credenciales_mp.clientSecret
FROM dias_turnos
JOIN rangos_horarios ON rangos_horarios.id_dia_turnos=dias_turnos.id
JOIN datos_negocios ON datos_negocios.id=dias_turnos.id_dato_negocio
JOIN credenciales_mp ON credenciales_mp.id_negocio=datos_negocios.id
WHERE datos_negocios.id= ?`,
      [id]
    );
    const turnos = await this.repo.query(
      `SELECT * 
FROM turnos
WHERE id_dato_negocio = ? AND fecha >= CURDATE()`,
      [id]
    );

    return {
      horarios,
      turnos
    }
  }
}
