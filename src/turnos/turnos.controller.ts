import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TurnosService } from './turnos.service';


@UseGuards(AuthGuard('jwt'))
@Controller('turnos')
export class TurnosController {
    constructor(private readonly turnosService: TurnosService) { }

    @Post()
    async create(
        @Body() body: { fechaDesde: string, fechaHasta: string, idNegocio: number },
        @Req() req
    ) {
        const { userId } = req.user as any;

        return await this.turnosService.create({
            fechaDesde: body.fechaDesde,
            fechaHasta: body.fechaHasta,
            idNegocio: body.idNegocio,
            userId,
        });
    }

    @Patch(':id')
    async actualizarTurno(
        @Req() req: Request,
        @Param('id') id: string,
        @Body() body: Partial<{ fechaDesde: string; fechaHasta: string; idNegocio: number }>
    ) {
        const { userId } = req.user as any;
        return await this.turnosService.update(+id, body, userId);
    }

    @Delete(':id')
    async eliminarTurno(@Req() req: Request, @Param('id') id: string) {
        const { userId } = req.user as any;
        return await this.turnosService.delete(+id, userId);
    }

    @Get()
    async obtenerTurnos(@Req() req: Request) {
        const { sub: idUsuario } = req.user as any;
        return await this.turnosService.findAll(idUsuario);
    }
}
