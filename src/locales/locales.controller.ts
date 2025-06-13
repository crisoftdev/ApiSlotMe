// src/locales/locales.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('locales')
export class LocalesController {
  constructor(private readonly localesService: LocalesService) { }

  @Get('buscar')
  async buscar(@Query('q') q: string) {
    return this.localesService.findAll(q);
  }

  @Get('buscarimages')
  async buscarimages(@Query('id') id: string) {
    return this.localesService.images(id);
  }
}
