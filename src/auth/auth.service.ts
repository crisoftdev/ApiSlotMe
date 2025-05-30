import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async validateUser(usuario: string, clave: string) {
        const user = await this.userService.findByCuit(usuario);
        console.log('🔍 Buscando usuario con usuario:', usuario);
        console.log('🔐 Usuario encontrado:', user);

        if (user && user['clave'] === clave) {
            const { clave, ...result } = user;
            return result;
        }

        console.log('❌ Contraseña incorrecta o usuario no encontrado');
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(usuario: string, clave: string) {
        return this.userService.create(usuario, clave);
    }

    async generateTokens(user: any) {
        console.log("🔍 User en generateTokens:", user);
        const payload = { email: user.email, sub: user.id };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '48h', // token de acceso corto
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '140h', // token de refresco largo
        });

        return {
            accessToken,
            refreshToken,
        };
    }
    verifyRefreshToken(token: string) {
        try {
            return this.jwtService.verify(token); // Podés usar otro secret si querés
        } catch (e) {
            throw new UnauthorizedException('Token de refresco inválido');
        }
    }

}

