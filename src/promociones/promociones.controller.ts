import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { PromocionesService } from './promociones.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('promociones')
export class PromocionesController {
  constructor(private readonly promocionesService: PromocionesService) { }

  @Post()
  async guardarPromocion(@Body() body: any, @Req() req: any) {
    const idUsuario = req.user.userId;
    return this.promocionesService.guardarPromocion(body, idUsuario);
  }

  @Get()
  async obtenerPorNegocio(@Body() body: any, @Req() req: any) {
    const idUsuario = req.user.userId;
    return this.promocionesService.obtenerPromociones(idUsuario);
  }

  @Patch(':id/estado')
  async actualizarEstado(@Param('id') id: number, @Body() body: any, @Req() req: any) {
    const idUsuario = req.user.userId;
    return this.promocionesService.actualizarEstado(id, body.estado, idUsuario);
  }
}
