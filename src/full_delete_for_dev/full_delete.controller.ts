import { Controller, Delete, HttpCode, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType, RegistrationDataType } from "src/utils/types";
import { NewPasswordType, RecoveryPasswordType } from "src/auth/dto/RecoveryPasswordType";
import { UsersType } from "src/users/dto/UsersType";
import { CommentsType } from "src/comments/dto/CommentsType";
import { PostsType } from "src/posts/dto/PostsType";
import { BlogsType } from "src/blogs/dto/BlogsType";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Controller('testing')
export class FullDataController {

    constructor (
        @InjectDataSource() protected dataSource: DataSource,
    ) {

    }
    @Delete('all-data')
    async deleteAllData () {
        await this.dataSource.createQueryBuilder().delete().from('users').execute();
        await this.dataSource.createQueryBuilder().delete().from('account_user_data').execute();
        await this.dataSource.createQueryBuilder().delete().from('ban_info').execute();
        await this.dataSource.createQueryBuilder().delete().from('email_confirmation').execute();
        await this.dataSource.createQueryBuilder().delete().from('recovery_password_info').execute();
        await this.dataSource.createQueryBuilder().delete().from('refresh_token_storage').execute();
        await this.dataSource.createQueryBuilder().delete().from('recovery_password').execute();
        await this.dataSource.createQueryBuilder().delete().from('new_password').execute();
        await this.dataSource.createQueryBuilder().delete().from('auth_data').execute();
        await this.dataSource.createQueryBuilder().delete().from('confirmed_attempt_data').execute();
        await this.dataSource.createQueryBuilder().delete().from('email_send_data').execute();
        await this.dataSource.createQueryBuilder().delete().from('registration_data').execute();
        await this.dataSource.createQueryBuilder().delete().from('blog').execute();
        throw new HttpException("Date is clear",HttpStatus.NO_CONTENT)
        }
}