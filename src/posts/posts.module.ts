import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { BlogsService } from "src/blogs/application/blogs.service";
import { BlogsModule } from "src/blogs/blogs.module";
import { JwtServiceClass } from "src/guards/jwt.service";
import { UsersModule } from "src/users/users.module";
import { PostsService } from "./application/posts.service";
import { PostController } from "./posts.controller";



@Module({
    imports: [UsersModule, AuthModule, BlogsModule],
    controllers: [PostController],
    providers: [ PostsService,BlogsService, JwtService, JwtServiceClass
    ],
  })
  export class PostsModule {}