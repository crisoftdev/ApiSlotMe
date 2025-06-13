// minegocio.controller.ts
import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MinegocioService } from './minegocio.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('minegocio')
export class MinegocioController {
    constructor(private readonly minegocioService: MinegocioService) { }

    @Get()
    async obtenerNegociosPorCategoria(@Req() req) {
        const { userId } = req.user as any;
        return this.minegocioService.obtenerNegocio(userId);
    }
    @Post('guardar')
    async guardarNegocio(@Req() req, @Body() body: any) {
        const { userId } = req.user as any;
        return this.minegocioService.guardarNegocio(userId, body);
    }
}
