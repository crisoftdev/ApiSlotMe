// cloudinary.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Req,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CloudinaryService } from './cloudinary.service';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';

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

  @Post('multiples')
  @UseInterceptors(FilesInterceptor('imagenes', 6))
  async uploadMultipleImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request
  ) {
    const userId = (req.user as any)?.userId;
    console.log("entra")
    if (!userId) throw new Error('Token inválido');
    console.log(userId)
    const urls = await Promise.all(
      files.map((file) => this.cloudinaryService.uploadImage(file))
    );

    const insertResult = await this.cloudinaryService.saveMultipleImageUrls(userId, urls.map(res => res.secure_url));

    return {
      urls: urls.map(res => res.secure_url),
      dbMessage: insertResult.message,
    };
  }

  @Post('eliminar')
  async eliminarImagenes(
    @Body('urls') urls: string[],
    @Req() req: Request
  ) {
    const userId = (req.user as any)?.userId;
    if (!userId) throw new Error('Token inválido');

    const resultados = await this.cloudinaryService.deleteImages(urls);

    return {
      eliminadas: resultados,
      message: 'Imágenes eliminadas de Cloudinary',
    };
  }

}
