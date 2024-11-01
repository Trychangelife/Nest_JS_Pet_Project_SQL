import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { CommentsController } from "./comments.controller";
import { CommentsRepository } from "./repositories/comments.repository";
import { CommentsService } from "./application/comments.service";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { JwtServiceClass } from "src/guards/jwt.service";

@Module({
    imports: [UsersModule],
    controllers: [CommentsController],
    providers: [CommentsRepository, CommentsService, 
      JwtServiceClass, JwtAuthGuard, JwtService, UsersModule
    ],
  })
  export class CommentsModule {}