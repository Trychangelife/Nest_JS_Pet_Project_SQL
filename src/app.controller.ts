import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import path from 'path';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHomePage(@Res() res: Response): void {
    // Отправляем картинку в ответ на запрос
    const imagePath = path.resolve(__dirname,`..`,`src` , 'image', 'first_page.jpg');
    
    res.sendFile(imagePath);
  } 
}
