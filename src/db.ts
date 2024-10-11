import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { RefreshTokenStorageType, ConfirmedAttemptDataType, RegistrationDataType, AuthDataType, EmailSendDataType } from "./utils/types";
import { RecoveryPasswordType, NewPasswordType } from "./auth/dto/RecoveryPasswordType";
import { UsersType } from "./users/dto/UsersType";
import { CommentsType } from "./comments/dto/CommentsType";
import { PostsType } from "./posts/dto/PostsType";
import { BlogsType } from "./blogs/dto/BlogsType";




export const blogsSchema = new mongoose.Schema<BlogsType>({
    id: {type:String, required:true},
    name: {type:String, required:true},
    description: {type:String, required: true},
    websiteUrl: {type:String, required:true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
    blogOwnerInfo: {
        userId: {type: String},
        userLogin: {type: String}
    }

})
export const postSchema = new mongoose.Schema<PostsType>({
    id: {type:String, required:true},
    title: {type:String},
    shortDescription: {type:String},
    content: {type:String},
    blogId: {type:String, required:true},
    blogName: {type:String, required:true},
    createdAt: {type: String, required: true},
    authorUserId: {type: String, required: false},
    extendedLikesInfo: {
        likesCount: {type: Number, required:true, default: 0},
        dislikesCount: {type: Number, required:true, default: 0},
        myStatus: {type: String},
        newestLikes: [
            {
                addedAt: {type: Date, required:false},
                userId: {type: String, required:false},
                login: {type: String, required:false}
            }
        ]
    },
    likeStorage: [
        {
        addedAt: {type: Date, required:false},
        userId: {type: String, required:false},
        login: {type: String, required:false}
}  ],
    dislikeStorage: [
        {
        addedAt: {type: Date, required:false},
        userId: {type: String, required:false},
        login: {type: String, required:false}
    }
]
}
    
    )
export const commentsSchema = new mongoose.Schema<CommentsType>({
    id: {type:String, required:true},
    content: {type:String, required:true},
    commentatorInfo: {
        userId: {type:String, required:true},
        userLogin: {type:String, required:true}
    },
    createdAt: {type:String, required:true},
    postId: {type:String, required:true},
    likesInfo: {
        likesCount: {type: Number, required:true, default: 0},
        dislikesCount: {type: Number, required:true, default: 0},
        myStatus: {type: String},
    },
    likeStorage: [
        {
        addedAt: {type: Date, required:false},
        userId: {type: String, required:false},
        login: {type: String, required:false}
}  ],
    dislikeStorage: [
        {
        addedAt: {type: Date, required:false},
        userId: {type: String, required:false},
        login: {type: String, required:false}
    }
]
})

export const usersSchema = new mongoose.Schema<UsersType>({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    id: {type: String, required: true},
    login: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    accountData: {
        passwordHash: {type: String, required: true},
        passwordSalt: {type: String, required: true},
        
    },
    emailConfirmation: {
        codeForActivated: {type: String, required: true},
        activatedStatus: {type: String, required: true}
    },
    recoveryPasswordInformation: {
        codeForRecovery: {type: String, required: false},
        createdDateRecoveryCode: {type: String, required: false}
    },
    banInfo: {
        isBanned: {type: Boolean},
        banDate: {type: String},
        banReason: {type: String}
    }
})
export const registrationDataSchema = new mongoose.Schema<RegistrationDataType>({
    ip: {type: String, required: true},
    dateRegistation: {type: Date, required: true},
    email: {type: String, required: true}
})
export const authDataSchema = new mongoose.Schema<AuthDataType>({
    ip: {type: String, required: true},
    tryAuthDate: {type: Date, required: true},
    login: {type: String, required: true}
})
export const emailSendSchema = new mongoose.Schema<EmailSendDataType>({
    ip: {type: String, required: true},
    emailSendDate: {type: Date, required: true},
    email: {type: String, required: true}
})
export const codeConfirmSchema = new mongoose.Schema<ConfirmedAttemptDataType>({
    ip: {type: String, required: true},
    tryConfirmDate: {type: Date, required: true},
    code: {type: String, required: true}
})
export const refreshTokenSchema = new mongoose.Schema<RefreshTokenStorageType>({
    userId: {type: String, required: true},
    refreshToken: {type: String, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    deviceId: {type: String, required: true},
    lastActiveDate: {type: Date, required: true}
})
export const recoveryPasswordSchema = new mongoose.Schema<RecoveryPasswordType>({
    ip: {type: String, required: true},
    emailSendDate: {type: Date},
    email: {type: String}
})
export const newPasswordSchema = new mongoose.Schema<NewPasswordType>({
    ip: {type: String, required: true},
    timestampNewPassword: {type: Date, required: true},
    recoveryCode: {type: String, required: true}
})

export const bloggerModel = mongoose.model('blogs', blogsSchema)
export const postsModel = mongoose.model('posts', postSchema)
export const usersModel = mongoose.model('users', usersSchema)
export const commentsModel = mongoose.model('comments', commentsSchema)
export const registrationDataModel = mongoose.model('registrationData', registrationDataSchema)
export const authDataModel = mongoose.model('authData', authDataSchema)
export const emailSendModel = mongoose.model('emailSend', emailSendSchema)
export const codeConfirmModel = mongoose.model('confirmAttemptLog', codeConfirmSchema)
export const refreshTokenModel = mongoose.model('refreshToken', refreshTokenSchema)
export const recoveryPasswordModel = mongoose.model('recoveryPassword', recoveryPasswordSchema)
export const newPasswordModel = mongoose.model('newPassword', newPasswordSchema)


// export async function runDb () {
// try {
//     await mongoose.connect(uri, options)
//     console.log("Connected successfully to mongo server")
// } catch (e) {
//     console.error(e);
//     await mongoose.disconnect()
// }}

