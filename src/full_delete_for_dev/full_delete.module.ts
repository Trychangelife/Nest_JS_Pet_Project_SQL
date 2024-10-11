import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { authDataSchema, blogsSchema, codeConfirmSchema, commentsSchema, emailSendSchema, newPasswordSchema, postSchema, recoveryPasswordSchema, refreshTokenSchema, registrationDataSchema, usersSchema } from "src/db";
import { FullDataController } from "./full_delete.controller";




@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Blogger', schema: blogsSchema}, 
        {name: 'Posts', schema: postSchema}, 
        {name: 'Comments', schema: commentsSchema},
        {name: 'Users', schema: usersSchema},
        {name: 'RegistrationData', schema: registrationDataSchema},
        {name: 'AuthData', schema: authDataSchema},
        {name: 'CodeConfirm', schema: codeConfirmSchema},
        {name: 'EmailSend', schema: emailSendSchema},
        {name: 'RefreshToken', schema: refreshTokenSchema},
        {name: 'RecoveryPassword', schema: recoveryPasswordSchema},
        {name: 'NewPassword', schema: newPasswordSchema}
    ])],
    controllers: [FullDataController],
    providers: [],
  })
  export class FullDeleteModule {}