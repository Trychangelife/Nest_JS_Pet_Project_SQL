import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { commentsSchema, postSchema, refreshTokenSchema, usersSchema } from "src/db";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "./application/blogs.service";
import { JwtService } from "@nestjs/jwt";
import { JwtServiceClass } from "src/guards/jwt.service";
import { PostsService } from "src/posts/application/posts.service";




@Module({
    imports: [MongooseModule.forFeature([
      //{name: 'Blogs', schema: blogsSchema}, 
    {name: 'Posts', schema: postSchema}, {name: 'Comments', schema: commentsSchema}, {name: 'Users', schema: usersSchema}, {name: 'RefreshToken', schema: refreshTokenSchema}
  ])],
    controllers: [BlogsController],
    providers: [ BlogsService, PostsService, JwtServiceClass, JwtService ]
  })
  export class BlogsModule {}