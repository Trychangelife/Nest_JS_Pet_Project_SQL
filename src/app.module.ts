import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import * as fs from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import { EmailModule } from './email/email.module';
import { FullDeleteModule } from './full_delete_for_dev/full_delete.module';
import { PostsModule } from './posts/posts.module';
import { SecurityDeviceModule } from './security_devices/security.module';
import { BlogsSuperAdminModule } from './superAdmin/SAblog/sa.blog.module';
import { UsersSuperAdminModule } from './superAdmin/SAusers/sa.users.module';
import { UsersModule } from './users/users.module';
import { GlobalModule } from './utils/global_modules';


@Module({
  imports: [
    BlogsModule,
    GlobalModule, 
    UsersModule, 
    AuthModule, 
    PostsModule,
    EmailModule,
    SecurityDeviceModule,
    BlogsSuperAdminModule,
    UsersSuperAdminModule,
    FullDeleteModule,
    CommentsModule,


  //Вариант для Aiven
  TypeOrmModule.forRoot({
    type: 'postgres', 
    host: process.env.POSTGRES_HOST,
    port: 18391, //Заменить на 5432 если это будет neonDB
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD, 
    database: process.env.POSTGRES_DATABASE_NAME,
    //url: process.env.DATABASE_URL,
    //autoLoadEntities: true,
    //synchronize: true,
    logging: false,
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync("./ca.pem").toString()
    }
  }), 

  // Локальная БД - для прохождения тестов т.к пинг либо оптимизация увеличивает время запроса к БД более 6 сек.
  // TypeOrmModule.forRoot({
  //      type: 'postgres',
  //      host: "localhost",
  //      port: 5432,
  //      username: "postgres",
  //      password: process.env.LOCAL_PASSWORD_DB,
  //      synchronize: true,
  //      maxQueryExecutionTime:10,
  //      poolSize: 100,
  //      logging: []
  //   }),
  // ConfigModule.forRoot({
  //   isGlobal: true,
  //   envFilePath: '.env'
  // }),
],
  controllers: [AppController],
  providers: [AppService,]

})
export class AppModule {}

