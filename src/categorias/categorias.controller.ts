import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriasService } from './categorias.service';

@Controller('categorias')
export class CategoriasController {
    constructor(private readonly categoriasService: CategoriasService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async obtenerCategorias(@Req() req) {
        return await this.categoriasService.obtenerCategorias();
    }

    // ✅ NUEVO ENDPOINT
    @UseGuards(AuthGuard('jwt'))
    @Get(':id/negocios')
    async obtenerNegociosPorCategoria(@Param('id') id: string, @Req() req) {
        const { userId } = req.user as any;
        return await this.categoriasService.obtenerNegociosPorCategoria(+id, userId);
    }

}
