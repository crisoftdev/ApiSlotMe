import {
    Controller,
    Get,
    Request,
    UseGuards,
    Post,
    Body,
    Patch,
    Req,
    Put
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { UserService } from './user.service';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Readable } from 'stream';
import cloudinary from '../cloudinary/cloudinary.config'; // ajustá la ruta si es distinta


@Controller('user')
export class UserController {
    constructor(
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Request() req) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('notificacion')
    async updateNotification(
        @Req() req: any,
        @Body('enabled') enabled: number, // esperás 0 o 1
    ) {
        const { userId } = req.user;
        await this.userService.updateNotification(userId, enabled);
        return { message: 'Notificación actualizada' };
    }
    @UseGuards(AuthGuard('jwt'))
    @Put('update')
    async updateUser(@Req() req, @Body() body: any) {
        const { userId } = req.user as any;
        return this.userService.updateUser(userId, body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('token')
    async saveExpoToken(
        @Request() req,
        @Body() body: { expoPushToken: string }
    ) {
        const { userId } = req.user as any;

        if (!body.expoPushToken) {
            return { message: 'Token vacío' };
        }

        await this.dataSource.query(
            `UPDATE usuarios SET token_notification = ? WHERE id = ?`,
            [body.expoPushToken, userId]
        );

        return { message: 'Token guardado correctamente' };
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('actualizaravatar')
    @UseInterceptors(FileInterceptor('file'))
    async actualizarAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
        const { userId } = req.user;

        // 1️⃣ Obtener avatar anterior de la base
        const [prevUser] = await this.dataSource.query(
            'SELECT avatar FROM usuarios WHERE id = ?',
            [userId]
        );

        const oldAvatar = prevUser?.avatar;

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'Avatares' },
                async (error, result) => {
                    if (error || !result) return reject(error || new Error('Error al subir a Cloudinary'));

                    const relativePath = result.secure_url.replace(/^https?:\/\/res\.cloudinary\.com\/[^/]+\//, '');

                    // 2️⃣ Guardar nuevo avatar en la base
                    await this.dataSource.query(
                        'UPDATE usuarios SET avatar = ? WHERE id = ?',
                        [relativePath, userId]
                    );
                    console.log("old:", oldAvatar)
                    // 3️⃣ Eliminar el avatar anterior de Cloudinary (si existe)
                    if (oldAvatar) {
                        // 1️⃣ Remover el prefijo "image/upload/vXXXX/"
                        const cleanedPath = oldAvatar.replace(/^image\/upload\/v\d+\//, '');

                        // 2️⃣ Sacar la extensión (.jpg, .png, etc.)
                        const publicId = cleanedPath.replace(/\.[a-zA-Z]+$/, '');

                        try {
                            await cloudinary.uploader.destroy(publicId);
                        } catch (err) {
                            console.warn('⚠️ No se pudo eliminar avatar anterior:', err.message);
                        }
                    }

                    resolve({
                        message: 'Avatar actualizado correctamente',
                        url: result.secure_url,
                        relativePath,
                    });
                }
            );

            Readable.from(file.buffer).pipe(stream);
        });
    }




}
