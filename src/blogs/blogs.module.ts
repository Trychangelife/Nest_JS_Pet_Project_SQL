import { Module } from "@nestjs/common";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "./application/blogs.service";
import { JwtService } from "@nestjs/jwt";
import { JwtServiceClass } from "src/guards/jwt.service";
import { PostsService } from "src/posts/application/posts.service";




@Module({
    imports: [],
    controllers: [BlogsController],
    providers: [ BlogsService, PostsService, JwtServiceClass, JwtService ]
  })
  export class BlogsModule {}