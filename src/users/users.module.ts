import { Module } from "@nestjs/common";
import { BlogsModule } from "src/blogs/blogs.module";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./repositories/users.repository";
import { UsersService } from "./application/users.service";



@Module({
    imports: [BlogsModule,],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, 
      //EmailService, EmailManager, EmailAdapter
    ],
    exports: [UsersService]
  })
  export class UsersModule {}