import { Module } from "@nestjs/common";
import { EmailModule } from "src/email/email.module";
import { UsersService } from "./application/users.service";
import { UsersRepository } from "./repositories/users.repository";
import { UsersController } from "./users.controller";
import { GetUserByUserIdUseCase } from "./application/use-cases/Get_user_by_id";
import { SuperAdminUsersRepositorySql } from "src/superAdmin/SAusers/repositories/SuperAdmin.user.repositorySQL";

const useCasesUsers = [GetUserByUserIdUseCase]

@Module({
    imports: [EmailModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, ...useCasesUsers, SuperAdminUsersRepositorySql],
    exports: [UsersService, UsersRepository, SuperAdminUsersRepositorySql]
  })
  export class UsersModule {}