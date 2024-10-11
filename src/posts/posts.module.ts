import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { BlogsModule } from "src/blogs/blogs.module";
import { UsersModule } from "src/users/users.module";
import { PostController } from "./posts.controller";
import { PostRepository } from "./repositories/posts.repository";
import { PostsService } from "./application/posts.service";
import { JwtService } from "@nestjs/jwt";
import { JwtServiceClass } from "src/guards/jwt.service";
import { BlogsRepository } from "src/blogs/repositories/blogs.repository";
import { BlogsService } from "src/blogs/application/blogs.service";
import { postSchema, blogsSchema, commentsSchema, refreshTokenSchema, usersSchema } from "src/db";



@Module({
    imports: [UsersModule, AuthModule, BlogsModule, MongooseModule.forFeature([
    {name: 'Posts', schema: postSchema},
    {name: 'Blogs', schema: blogsSchema}, 
    {name: 'Comments', schema: commentsSchema},
    {name: 'RefreshToken', schema: refreshTokenSchema},
    {name: 'Users', schema: usersSchema}
  ])],
    controllers: [PostController],
    providers: [PostRepository, PostsService, 
    BlogsRepository,BlogsService, JwtService, JwtServiceClass
    ],
  })
  export class PostsModule {}