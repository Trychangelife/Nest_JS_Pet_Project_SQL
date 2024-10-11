import { Model } from "mongoose";
import { AuthDataType, ConfirmedAttemptDataType, EmailSendDataType, RefreshTokenStorageType, RegistrationDataType } from "src/utils/types";
import { NewPasswordType, RecoveryPasswordType } from "src/auth/dto/RecoveryPasswordType";
import { UsersType } from "src/users/dto/UsersType";
import { CommentsType } from "src/comments/dto/CommentsType";
import { PostsType } from "src/posts/dto/PostsType";
import { BlogsType } from "src/blogs/dto/BlogsType";
export declare class FullDataController {
    protected postsModel: Model<PostsType>;
    protected bloggerModel: Model<BlogsType>;
    protected commentsModel: Model<CommentsType>;
    protected usersModel: Model<UsersType>;
    protected registrationDataModel: Model<RegistrationDataType>;
    protected authDataModel: Model<AuthDataType>;
    protected codeConfirmModel: Model<ConfirmedAttemptDataType>;
    protected emailSendModel: Model<EmailSendDataType>;
    protected refreshTokenModel: Model<RefreshTokenStorageType>;
    protected newPasswordModel: Model<NewPasswordType>;
    protected recoveryPasswordModel: Model<RecoveryPasswordType>;
    constructor(postsModel: Model<PostsType>, bloggerModel: Model<BlogsType>, commentsModel: Model<CommentsType>, usersModel: Model<UsersType>, registrationDataModel: Model<RegistrationDataType>, authDataModel: Model<AuthDataType>, codeConfirmModel: Model<ConfirmedAttemptDataType>, emailSendModel: Model<EmailSendDataType>, refreshTokenModel: Model<RefreshTokenStorageType>, newPasswordModel: Model<NewPasswordType>, recoveryPasswordModel: Model<RecoveryPasswordType>);
    deleteAllData(): Promise<void>;
}
