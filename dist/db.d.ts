import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { RefreshTokenStorageType, ConfirmedAttemptDataType, RegistrationDataType, AuthDataType, EmailSendDataType } from "./utils/types";
import { RecoveryPasswordType, NewPasswordType } from "./auth/dto/RecoveryPasswordType";
import { UsersType } from "./users/dto/UsersType";
import { CommentsType } from "./comments/dto/CommentsType";
import { PostsType } from "./posts/dto/PostsType";
import { BlogsType } from "./blogs/dto/BlogsType";
export declare const blogsSchema: mongoose.Schema<BlogsType, mongoose.Model<BlogsType, any, any, any, mongoose.Document<unknown, any, BlogsType> & BlogsType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, BlogsType, mongoose.Document<unknown, {}, mongoose.FlatRecord<BlogsType>> & mongoose.FlatRecord<BlogsType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const postSchema: mongoose.Schema<PostsType, mongoose.Model<PostsType, any, any, any, mongoose.Document<unknown, any, PostsType> & PostsType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, PostsType, mongoose.Document<unknown, {}, mongoose.FlatRecord<PostsType>> & mongoose.FlatRecord<PostsType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const commentsSchema: mongoose.Schema<CommentsType, mongoose.Model<CommentsType, any, any, any, mongoose.Document<unknown, any, CommentsType> & CommentsType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, CommentsType, mongoose.Document<unknown, {}, mongoose.FlatRecord<CommentsType>> & mongoose.FlatRecord<CommentsType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const usersSchema: mongoose.Schema<UsersType, mongoose.Model<UsersType, any, any, any, mongoose.Document<unknown, any, UsersType> & UsersType & Required<{
    _id: ObjectId;
}> & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, UsersType, mongoose.Document<unknown, {}, mongoose.FlatRecord<UsersType>> & mongoose.FlatRecord<UsersType> & Required<{
    _id: ObjectId;
}> & {
    __v?: number;
}>;
export declare const registrationDataSchema: mongoose.Schema<RegistrationDataType, mongoose.Model<RegistrationDataType, any, any, any, mongoose.Document<unknown, any, RegistrationDataType> & RegistrationDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RegistrationDataType, mongoose.Document<unknown, {}, mongoose.FlatRecord<RegistrationDataType>> & mongoose.FlatRecord<RegistrationDataType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const authDataSchema: mongoose.Schema<AuthDataType, mongoose.Model<AuthDataType, any, any, any, mongoose.Document<unknown, any, AuthDataType> & AuthDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, AuthDataType, mongoose.Document<unknown, {}, mongoose.FlatRecord<AuthDataType>> & mongoose.FlatRecord<AuthDataType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const emailSendSchema: mongoose.Schema<EmailSendDataType, mongoose.Model<EmailSendDataType, any, any, any, mongoose.Document<unknown, any, EmailSendDataType> & EmailSendDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, EmailSendDataType, mongoose.Document<unknown, {}, mongoose.FlatRecord<EmailSendDataType>> & mongoose.FlatRecord<EmailSendDataType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const codeConfirmSchema: mongoose.Schema<ConfirmedAttemptDataType, mongoose.Model<ConfirmedAttemptDataType, any, any, any, mongoose.Document<unknown, any, ConfirmedAttemptDataType> & ConfirmedAttemptDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ConfirmedAttemptDataType, mongoose.Document<unknown, {}, mongoose.FlatRecord<ConfirmedAttemptDataType>> & mongoose.FlatRecord<ConfirmedAttemptDataType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const refreshTokenSchema: mongoose.Schema<RefreshTokenStorageType, mongoose.Model<RefreshTokenStorageType, any, any, any, mongoose.Document<unknown, any, RefreshTokenStorageType> & RefreshTokenStorageType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RefreshTokenStorageType, mongoose.Document<unknown, {}, mongoose.FlatRecord<RefreshTokenStorageType>> & mongoose.FlatRecord<RefreshTokenStorageType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const recoveryPasswordSchema: mongoose.Schema<RecoveryPasswordType, mongoose.Model<RecoveryPasswordType, any, any, any, mongoose.Document<unknown, any, RecoveryPasswordType> & RecoveryPasswordType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RecoveryPasswordType, mongoose.Document<unknown, {}, mongoose.FlatRecord<RecoveryPasswordType>> & mongoose.FlatRecord<RecoveryPasswordType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const newPasswordSchema: mongoose.Schema<NewPasswordType, mongoose.Model<NewPasswordType, any, any, any, mongoose.Document<unknown, any, NewPasswordType> & NewPasswordType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, NewPasswordType, mongoose.Document<unknown, {}, mongoose.FlatRecord<NewPasswordType>> & mongoose.FlatRecord<NewPasswordType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>;
export declare const bloggerModel: mongoose.Model<BlogsType, {}, {}, {}, mongoose.Document<unknown, {}, BlogsType> & BlogsType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, mongoose.Schema<BlogsType, mongoose.Model<BlogsType, any, any, any, mongoose.Document<unknown, any, BlogsType> & BlogsType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, BlogsType, mongoose.Document<unknown, {}, mongoose.FlatRecord<BlogsType>> & mongoose.FlatRecord<BlogsType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>>;
export declare const postsModel: mongoose.Model<PostsType, {}, {}, {}, mongoose.Document<unknown, {}, PostsType> & PostsType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, mongoose.Schema<PostsType, mongoose.Model<PostsType, any, any, any, mongoose.Document<unknown, any, PostsType> & PostsType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, PostsType, mongoose.Document<unknown, {}, mongoose.FlatRecord<PostsType>> & mongoose.FlatRecord<PostsType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>>;
export declare const usersModel: mongoose.Model<UsersType, {}, {}, {}, mongoose.Document<unknown, {}, UsersType> & UsersType & Required<{
    _id: ObjectId;
}> & {
    __v?: number;
}, mongoose.Schema<UsersType, mongoose.Model<UsersType, any, any, any, mongoose.Document<unknown, any, UsersType> & UsersType & Required<{
    _id: ObjectId;
}> & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, UsersType, mongoose.Document<unknown, {}, mongoose.FlatRecord<UsersType>> & mongoose.FlatRecord<UsersType> & Required<{
    _id: ObjectId;
}> & {
    __v?: number;
}>>;
export declare const commentsModel: mongoose.Model<CommentsType, {}, {}, {}, mongoose.Document<unknown, {}, CommentsType> & CommentsType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, mongoose.Schema<CommentsType, mongoose.Model<CommentsType, any, any, any, mongoose.Document<unknown, any, CommentsType> & CommentsType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, CommentsType, mongoose.Document<unknown, {}, mongoose.FlatRecord<CommentsType>> & mongoose.FlatRecord<CommentsType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>>;
export declare const registrationDataModel: mongoose.Model<RegistrationDataType, {}, {}, {}, mongoose.Document<unknown, {}, RegistrationDataType> & RegistrationDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, mongoose.Schema<RegistrationDataType, mongoose.Model<RegistrationDataType, any, any, any, mongoose.Document<unknown, any, RegistrationDataType> & RegistrationDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RegistrationDataType, mongoose.Document<unknown, {}, mongoose.FlatRecord<RegistrationDataType>> & mongoose.FlatRecord<RegistrationDataType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>>;
export declare const authDataModel: mongoose.Model<AuthDataType, {}, {}, {}, mongoose.Document<unknown, {}, AuthDataType> & AuthDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, mongoose.Schema<AuthDataType, mongoose.Model<AuthDataType, any, any, any, mongoose.Document<unknown, any, AuthDataType> & AuthDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, AuthDataType, mongoose.Document<unknown, {}, mongoose.FlatRecord<AuthDataType>> & mongoose.FlatRecord<AuthDataType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>>;
export declare const emailSendModel: mongoose.Model<EmailSendDataType, {}, {}, {}, mongoose.Document<unknown, {}, EmailSendDataType> & EmailSendDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, mongoose.Schema<EmailSendDataType, mongoose.Model<EmailSendDataType, any, any, any, mongoose.Document<unknown, any, EmailSendDataType> & EmailSendDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, EmailSendDataType, mongoose.Document<unknown, {}, mongoose.FlatRecord<EmailSendDataType>> & mongoose.FlatRecord<EmailSendDataType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>>;
export declare const codeConfirmModel: mongoose.Model<ConfirmedAttemptDataType, {}, {}, {}, mongoose.Document<unknown, {}, ConfirmedAttemptDataType> & ConfirmedAttemptDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, mongoose.Schema<ConfirmedAttemptDataType, mongoose.Model<ConfirmedAttemptDataType, any, any, any, mongoose.Document<unknown, any, ConfirmedAttemptDataType> & ConfirmedAttemptDataType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ConfirmedAttemptDataType, mongoose.Document<unknown, {}, mongoose.FlatRecord<ConfirmedAttemptDataType>> & mongoose.FlatRecord<ConfirmedAttemptDataType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>>;
export declare const refreshTokenModel: mongoose.Model<RefreshTokenStorageType, {}, {}, {}, mongoose.Document<unknown, {}, RefreshTokenStorageType> & RefreshTokenStorageType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, mongoose.Schema<RefreshTokenStorageType, mongoose.Model<RefreshTokenStorageType, any, any, any, mongoose.Document<unknown, any, RefreshTokenStorageType> & RefreshTokenStorageType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RefreshTokenStorageType, mongoose.Document<unknown, {}, mongoose.FlatRecord<RefreshTokenStorageType>> & mongoose.FlatRecord<RefreshTokenStorageType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>>;
export declare const recoveryPasswordModel: mongoose.Model<RecoveryPasswordType, {}, {}, {}, mongoose.Document<unknown, {}, RecoveryPasswordType> & RecoveryPasswordType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, mongoose.Schema<RecoveryPasswordType, mongoose.Model<RecoveryPasswordType, any, any, any, mongoose.Document<unknown, any, RecoveryPasswordType> & RecoveryPasswordType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, RecoveryPasswordType, mongoose.Document<unknown, {}, mongoose.FlatRecord<RecoveryPasswordType>> & mongoose.FlatRecord<RecoveryPasswordType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>>;
export declare const newPasswordModel: mongoose.Model<NewPasswordType, {}, {}, {}, mongoose.Document<unknown, {}, NewPasswordType> & NewPasswordType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, mongoose.Schema<NewPasswordType, mongoose.Model<NewPasswordType, any, any, any, mongoose.Document<unknown, any, NewPasswordType> & NewPasswordType & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, NewPasswordType, mongoose.Document<unknown, {}, mongoose.FlatRecord<NewPasswordType>> & mongoose.FlatRecord<NewPasswordType> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v?: number;
}>>;
