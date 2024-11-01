import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { EmailAdapter } from "src/email/email.adapter";
import { EmailManager } from "src/email/email.manager";
import { EmailService } from "src/email/email.service";
import { JwtServiceClass } from "src/guards/jwt.service";
import { UsersService } from "src/users/application/users.service";
import { UsersRepository } from "src/users/repositories/users.repository";
import { AuthService } from "./application/auth.service";
import { AuthController } from "./auth.controller";

@Module({
    imports: [MongooseModule.forFeature([
        // {name: 'Users', schema: usersSchema},
        // {name: 'RegistrationData', schema: registrationDataSchema}, 
        // {name: 'AuthData', schema: authDataSchema},
        // {name: 'CodeConfirm', schema: codeConfirmSchema},
        // {name: 'EmailSend', schema: emailSendSchema},
        // {name: 'RefreshToken', schema: refreshTokenSchema},
    ]),
        JwtModule.register({
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