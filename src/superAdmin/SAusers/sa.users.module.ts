
import { Module } from "@nestjs/common";
import { CreateUserSAUseCase } from "./application/useCases/create_user_SA";
import { CheckBanStatusSuperAdminUseCase } from "./application/useCases/check_banStatus";
import { GetAllUsersAsSuperAdminUseCase } from "./application/useCases/get_all_user_SA";
import { DeleteUserAsSuperAdminUseCase } from "./application/useCases/delete_user_SA";
import { BanUserAsSuperAdminUseCase } from "./application/useCases/ban_user_SA";
import { SuperAdminBlogsController } from "../SAblog/sa.blog.controller";
import { SuperAdminUsersRepositorySql } from "./repositories/SuperAdmin.user.repositorySQL";
import { EmailModule } from "src/email/email.module";

const useCasesSuperAdminUsers = [CreateUserSAUseCase, CheckBanStatusSuperAdminUseCase, GetAllUsersAsSuperAdminUseCase, DeleteUserAsSuperAdminUseCase, BanUserAsSuperAdminUseCase]

@Module({

    imports: [EmailModule],
    controllers: [SuperAdminBlogsController],
    providers: [...useCasesSuperAdminUsers, SuperAdminUsersRepositorySql],
    exports: [SuperAdminUsersRepositorySql]
  })
  export class UsersSuperAdminModule {}