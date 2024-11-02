import { Module } from "@nestjs/common";
import { BlogsModule } from "src/blogs/blogs.module";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./repositories/users.repository";
import { UsersService } from "./application/users.service";
import { EmailModule } from "src/email/email.module";
import { GetUserByUserIdUseCase } from "./application/use-cases/Get_user_by_id";

const useCasesUsers = [GetUserByUserIdUseCase]

@Module({
    imports: [EmailModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository 
    ],
    exports: [UsersService, UsersRepository]
  })
  export class UsersModule {}