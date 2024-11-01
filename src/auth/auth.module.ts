import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { EmailAdapter } from "src/email/email.adapter";
import { EmailManager } from "src/email/email.manager";
import { EmailService } from "src/email/email.service";
import { JwtServiceClass } from "src/guards/jwt.service";
import { UsersService } from "src/users/application/users.service";
import { UsersRepository } from "src/users/repositories/users.repository";
import { AuthService } from "./application/auth.service";
import { AuthController } from "./auth.controller";

@Module({
    imports: [JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '24h'
            }
        })],
    controllers: [AuthController],
    providers: [AuthService, UsersRepository, UsersService, EmailService, JwtServiceClass, EmailManager, EmailAdapter],
    exports: [JwtServiceClass, JwtModule]
  })
  export class AuthModule {}