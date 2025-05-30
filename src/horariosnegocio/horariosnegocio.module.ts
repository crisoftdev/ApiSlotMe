// src/locales/locales.module.ts
import { Module } from '@nestjs/common';
import { HorariosnegocioService } from './horariosnegocio.service';
import { HorariosNegociosController } from './horariosnegocio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorariosNegocio } from './horariosnegocios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HorariosNegocio])], // 👈 ESTO ES CRUCIAL
  controllers: [HorariosNegociosController],
  providers: [HorariosnegocioService],
})
export class HorariosNegocioModule { }
