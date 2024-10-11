import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { commentsSchema, refreshTokenSchema, usersSchema } from "src/db";
import { UsersModule } from "src/users/users.module";
import { CommentsController } from "./comments.controller";
import { CommentsRepository } from "./repositories/comments.repository";
import { CommentsService } from "./application/comments.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { JwtServiceClass } from "src/guards/jwt.service";

@Module({
    imports: [UsersModule ,MongooseModule.forFeature([{name: 'Comments', schema: commentsSchema}, 
    {name: 'RefreshToken', schema: refreshTokenSchema}, {name: 'Users', schema: usersSchema}
  ])],
    controllers: [CommentsController],
    providers: [CommentsRepository, CommentsService, 
      JwtServiceClass, JwtAuthGuard, JwtService, UsersModule
    ],
  })
  export class CommentsModule {}