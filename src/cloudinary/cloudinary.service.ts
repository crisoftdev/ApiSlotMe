// cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import cloudinary from './cloudinary.config';
import { UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CloudinaryService {
  constructor(@InjectDataSource() private dataSource: DataSource) { }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'Portadas' },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Sin respuesta de Cloudinary'));
          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }

  async updateNegocioImage(userId: number, tipo: '1' | '2', imageUrl: string) {
    try {
      const relativePath = imageUrl.replace(/^https?:\/\/res\.cloudinary\.com\/[^/]+\//, '');
      const campo = tipo === '1' ? 'logo' : 'banner';

      const query = `UPDATE datos_negocios SET ${campo} = ? WHERE id_usuario = ?`;
      await this.dataSource.query(query, [relativePath, userId]);
      return { message: `Campo ${campo} actualizado con éxito` };
    } catch (error) {
      console.log(error)
    }

  }
}
