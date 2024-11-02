import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./application/auth.service";
import { AuthController } from "./auth.controller";
import { EmailModule } from "src/email/email.module";

@Module({
    imports: [UsersModule, EmailModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
  })
  export class AuthModule {}