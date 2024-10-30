import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "src/auth/auth.module";
import { BlogsModule } from "src/blogs/blogs.module";
import { UsersModule } from "src/users/users.module";
import { PostController } from "./posts.controller";
import { PostsService } from "./application/posts.service";
import { JwtService } from "@nestjs/jwt";
import { JwtServiceClass } from "src/guards/jwt.service";
import { BlogsService } from "src/blogs/application/blogs.service";



@Module({
    imports: [UsersModule, AuthModule, BlogsModule, MongooseModule.forFeature([
    //{name: 'Posts', schema: postSchema},
    //{name: 'Blogs', schema: blogsSchema}, 
    //{name: 'Comments', schema: commentsSchema},
    //{name: 'RefreshToken', schema: refreshTokenSchema},
    //{name: 'Users', schema: usersSchema}
  ])],
    controllers: [PostController],
    providers: [ PostsService,BlogsService, JwtService, JwtServiceClass
    ],
  })
  export class PostsModule {}