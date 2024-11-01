require('dotenv').config({ path: `../${process.env.NODE_ENV}.env` })
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';



 
export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({
    stopAtFirstError: true,
    transform: true,
    exceptionFactory: (errors) => {
      const customErrors = [];
      errors.forEach(e => {
        const keys = Object.keys(e.constraints)
        keys.forEach(k => {
          customErrors.push({
            message: e.constraints[k],
            field: e.property,
          })
        })
      })
      throw new BadRequestException(customErrors)
    }  
  }))
  await app.listen(process.env.PORT);
  console.log(`Server listening on port: ${process.env.PORT}`);
}
bootstrap();

