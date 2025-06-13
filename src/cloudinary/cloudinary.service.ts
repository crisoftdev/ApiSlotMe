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

  async saveMultipleImageUrls(userId: number, urls: string[]) {
    try {
      const result = await this.dataSource.query(
        `SELECT id FROM datos_negocios WHERE id_usuario = ?`,
        [userId]
      );

      if (!result.length) throw new Error('Negocio no encontrado');

      const id_negocio = result[0].id;

      for (const url of urls) {
        const relativePath = url.replace(/^https?:\/\/res\.cloudinary\.com\/[^/]+\//, '');

        await this.dataSource.query(
          `INSERT INTO imagenes_negocio (id_negocio, url) VALUES (?, ?)`,
          [id_negocio, relativePath]
        );
      }

      return { message: 'Imágenes guardadas en la base de datos' };
    } catch (error) {
      console.error(error);
      throw new Error('Error al guardar imágenes en la base de datos');
    }
  }

  async deleteImages(urls: string[]) {
    try {
      const results: { publicId: string; result: any }[] = [];

      for (const fullUrl of urls) {
        const relativePath = fullUrl.replace(/^https?:\/\/res\.cloudinary\.com\/[^/]+\//, '');
        const publicId = relativePath.replace(/\.[a-zA-Z]+$/, '');

        const res = await cloudinary.uploader.destroy(publicId);
        results.push({ publicId, result: res });
      }

      return results;
    } catch (error) {
      console.error('Error al eliminar imágenes de Cloudinary:', error);
      throw new Error('Error al eliminar imágenes');
    }
  }




}
