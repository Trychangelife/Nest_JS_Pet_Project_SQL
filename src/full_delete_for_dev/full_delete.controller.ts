import { Controller, Delete, HttpCode, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType, RegistrationDataType } from "src/utils/types";
import { NewPasswordType, RecoveryPasswordType } from "src/auth/dto/RecoveryPasswordType";
import { UsersType } from "src/users/dto/UsersType";
import { CommentsType } from "src/comments/dto/CommentsType";
import { PostsType } from "src/posts/dto/PostsType";
import { BlogsType } from "src/blogs/dto/BlogsType";

@Controller('testing')
export class FullDataController {

    constructor (
        @InjectModel('Posts') protected postsModel: Model<PostsType>, 
        @InjectModel('Blogs') protected bloggerModel: Model<BlogsType>, 
        @InjectModel('Comments') protected commentsModel: Model<CommentsType>,
        @InjectModel('Users') protected usersModel: Model<UsersType>,
        @InjectModel('RegistrationData') protected registrationDataModel: Model<RegistrationDataType>,
        @InjectModel('AuthData') protected authDataModel: Model<AuthDataType>,
        @InjectModel('CodeConfirm') protected codeConfirmModel: Model<ConfirmedAttemptDataType>,
        @InjectModel('EmailSend') protected emailSendModel: Model<EmailSendDataType>,
        @InjectModel('RefreshToken') protected refreshTokenModel: Model<RefreshTokenStorageType>,
        @InjectModel('NewPassword') protected newPasswordModel: Model<NewPasswordType>,
        @InjectModel('RecoveryPassword') protected recoveryPasswordModel: Model<RecoveryPasswordType>
    ) {

    }
    @Delete('all-data')
    async deleteAllData () {
        await this.postsModel.deleteMany()
        await this.bloggerModel.deleteMany()
        await this.usersModel.deleteMany()
        await this.commentsModel.deleteMany()
        await this.registrationDataModel.deleteMany()
        await this.authDataModel.deleteMany()
        await this.codeConfirmModel.deleteMany()
        await this.emailSendModel.deleteMany()
        await this.refreshTokenModel.deleteMany()
        await this.newPasswordModel.deleteMany()
        await this.recoveryPasswordModel.deleteMany()
        throw new HttpException("Date is clear",HttpStatus.NO_CONTENT)
        }
}