// cloudinary.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('upload')
export class UploadController {
  constructor(private cloudinaryService: CloudinaryService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('tipo') tipo: '1' | '2',
    @Req() req: Request
  ) {
    const userId = (req.user as any)?.userId;
    if (!userId) throw new Error('Token inválido');

    const res = await this.cloudinaryService.uploadImage(file);
    const updateResult = await this.cloudinaryService.updateNegocioImage(userId, tipo, res.secure_url);

    return {
      url: res.secure_url,
      cloudinaryMessage: 'Imagen subida con éxito',
      dbMessage: updateResult?.message,
    };
  }
}
