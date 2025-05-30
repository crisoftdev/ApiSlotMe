// home.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) { }

    @Get()
    getAll(@Req() req: Request) {
        const { userId } = req.user as any;
        console.log(userId)
        return this.homeService.findAll(userId);
    }
}
