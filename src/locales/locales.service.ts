// src/locales/locales.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locales } from './locales.entity';

@Injectable()
export class LocalesService {
  constructor(@InjectRepository(Locales) private repo: Repository<Locales>) {}

  async findAll(q: string) {
    console.log(q)
    const locales = await this.repo.query(
      `SELECT * FROM datos_negocios WHERE nombre LIKE ? LIMIT 10`,
      [`%${q}%`]
    );
    return locales;
  }
}
