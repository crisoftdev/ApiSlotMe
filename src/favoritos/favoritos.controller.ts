import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FavoritosService } from './favoritos.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('favoritos')
export class FavoritosController {
    constructor(private readonly favoritosService: FavoritosService) { }

    @UseGuards(AuthGuard('jwt')) // ✅ Protege el endpoint
    @Post('toggle')
    async toggle(
        @Body() body: { id_dato_negocio: number },
        @Req() req: Request,
    ) {
        const { userId } = req.user as any;
        console.log('🔐 userId desde token:', userId);
        return this.favoritosService.toggleFavorito(userId, body.id_dato_negocio);
    }
}
