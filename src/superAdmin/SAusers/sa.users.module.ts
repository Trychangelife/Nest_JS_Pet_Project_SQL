
import { Module } from "@nestjs/common";
import { EmailModule } from "src/email/email.module";
import { SuperAdminBlogsController } from "../SAblog/sa.blog.controller";
import { SuperAdminUsersRepositorySql } from "./repositories/SuperAdmin.user.repositorySQL";
import { BanUserAsSuperAdminUseCase } from "./application/useCases/ban_user_SA";
import { CheckBanStatusSuperAdminUseCase } from "./application/useCases/check_banStatus";
import { CreateUserSAUseCase } from "./application/useCases/create_user_SA";
import { DeleteUserAsSuperAdminUseCase } from "./application/useCases/delete_user_SA";
import { GetAllUsersAsSuperAdminUseCase } from "./application/useCases/get_all_user_SA";
import { CqrsModule } from "@nestjs/cqrs";
import { BindingBlogSuperAdminUseCase } from "../SAblog/application/use-cases/binding_blog";
import { BlogsSuperAdminModule } from "../SAblog/sa.blog.module";
import { SuperAdminUsersController } from "./sa.users.controller";
import { UsersRepository } from "src/users/repositories/users.repository";

const useCasesSuperAdminUsers = [CreateUserSAUseCase, CheckBanStatusSuperAdminUseCase, GetAllUsersAsSuperAdminUseCase, DeleteUserAsSuperAdminUseCase, BanUserAsSuperAdminUseCase, BindingBlogSuperAdminUseCase]


@Module({

    imports: [EmailModule, CqrsModule, BlogsSuperAdminModule],
    controllers: [SuperAdminUsersController],
    providers: [ SuperAdminUsersRepositorySql, ...useCasesSuperAdminUsers, UsersRepository],
    exports: [SuperAdminUsersRepositorySql]
  })
  export class UsersSuperAdminModule {}