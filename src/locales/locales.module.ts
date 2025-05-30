// src/locales/locales.module.ts
import { Module } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { LocalesController } from './locales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Locales } from './locales.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Locales])], // 👈 ESTO ES CRUCIAL
  controllers: [LocalesController],
  providers: [LocalesService],
})
export class LocalesModule { }
