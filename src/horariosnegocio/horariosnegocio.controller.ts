import { HorariosnegocioService } from './horariosnegocio.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('horariosnegocios')
export class HorariosNegociosController {
  constructor(private readonly horariosnegocioService: HorariosnegocioService) {}

  @Get('buscar')
  async buscar(@Query('id') id: string) {
    return this.horariosnegocioService.findAll(id);
  }
}
