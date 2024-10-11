import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogsModule } from "../blogs/blogs.module";
import { usersSchema } from "../db";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./repositories/users.repository";
import { UsersService } from "./application/users.service";



@Module({
    imports: [BlogsModule, MongooseModule.forFeature([
    {name: 'Users', schema: usersSchema},
    //{name: 'RegistrationData', schema: registrationDataSchema}, 
    //{name: 'AuthData', schema: authDataSchema},
    //{name: 'CodeConfirm', schema: codeConfirmSchema},
    //{name: 'EmailSend', schema: emailSendSchema},
    //{name: 'RefreshToken', schema: refreshTokenSchema},
  ])],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository, 
      //EmailService, EmailManager, EmailAdapter
    ],
    exports: [UsersService]
  })
  export class UsersModule {}