"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPasswordModel = exports.recoveryPasswordModel = exports.refreshTokenModel = exports.codeConfirmModel = exports.emailSendModel = exports.authDataModel = exports.registrationDataModel = exports.commentsModel = exports.usersModel = exports.postsModel = exports.bloggerModel = exports.newPasswordSchema = exports.recoveryPasswordSchema = exports.refreshTokenSchema = exports.codeConfirmSchema = exports.emailSendSchema = exports.authDataSchema = exports.registrationDataSchema = exports.usersSchema = exports.commentsSchema = exports.postSchema = exports.blogsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.blogsSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
    blogOwnerInfo: {
        userId: { type: String },
        userLogin: { type: String }
    }
});
exports.postSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    title: { type: String },
    shortDescription: { type: String },
    content: { type: String },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    authorUserId: { type: String, required: false },
    extendedLikesInfo: {
        likesCount: { type: Number, required: true, default: 0 },
        dislikesCount: { type: Number, required: true, default: 0 },
        myStatus: { type: String },
        newestLikes: [
            {
                addedAt: { type: Date, required: false },
                userId: { type: String, required: false },
                login: { type: String, required: false }
            }
        ]
    },
    likeStorage: [
        {
            addedAt: { type: Date, required: false },
            userId: { type: String, required: false },
            login: { type: String, required: false }
        }
    ],
    dislikeStorage: [
        {
            addedAt: { type: Date, required: false },
            userId: { type: String, required: false },
            login: { type: String, required: false }
        }
    ]
});
exports.commentsSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true }
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true },
    likesInfo: {
        likesCount: { type: Number, required: true, default: 0 },
        dislikesCount: { type: Number, required: true, default: 0 },
        myStatus: { type: String },
    },
    likeStorage: [
        {
            addedAt: { type: Date, required: false },
            userId: { type: String, required: false },
            login: { type: String, required: false }
        }
    ],
    dislikeStorage: [
        {
            addedAt: { type: Date, required: false },
            userId: { type: String, required: false },
            login: { type: String, required: false }
        }
    ]
});
exports.usersSchema = new mongoose_1.default.Schema({
    _id: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    accountData: {
        passwordHash: { type: String, required: true },
        passwordSalt: { type: String, required: true },
    },
    emailConfirmation: {
        codeForActivated: { type: String, required: true },
        activatedStatus: { type: String, required: true }
    },
    recoveryPasswordInformation: {
        codeForRecovery: { type: String, required: false },
        createdDateRecoveryCode: { type: String, required: false }
    },
    banInfo: {
        isBanned: { type: Boolean },
        banDate: { type: String },
        banReason: { type: String }
    }
});
exports.registrationDataSchema = new mongoose_1.default.Schema({
    ip: { type: String, required: true },
    dateRegistation: { type: Date, required: true },
    email: { type: String, required: true }
});
exports.authDataSchema = new mongoose_1.default.Schema({
    ip: { type: String, required: true },
    tryAuthDate: { type: Date, required: true },
    login: { type: String, required: true }
});
exports.emailSendSchema = new mongoose_1.default.Schema({
    ip: { type: String, required: true },
    emailSendDate: { type: Date, required: true },
    email: { type: String, required: true }
});
exports.codeConfirmSchema = new mongoose_1.default.Schema({
    ip: { type: String, required: true },
    tryConfirmDate: { type: Date, required: true },
    code: { type: String, required: true }
});
exports.refreshTokenSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    refreshToken: { type: String, required: true },
    ip: { type: String, required: true },
    title: { type: String, required: true },
    deviceId: { type: String, required: true },
    lastActiveDate: { type: Date, required: true }
});
exports.recoveryPasswordSchema = new mongoose_1.default.Schema({
    ip: { type: String, required: true },
    emailSendDate: { type: Date },
    email: { type: String }
});
exports.newPasswordSchema = new mongoose_1.default.Schema({
    ip: { type: String, required: true },
    timestampNewPassword: { type: Date, required: true },
    recoveryCode: { type: String, required: true }
});
exports.bloggerModel = mongoose_1.default.model('blogs', exports.blogsSchema);
exports.postsModel = mongoose_1.default.model('posts', exports.postSchema);
exports.usersModel = mongoose_1.default.model('users', exports.usersSchema);
exports.commentsModel = mongoose_1.default.model('comments', exports.commentsSchema);
exports.registrationDataModel = mongoose_1.default.model('registrationData', exports.registrationDataSchema);
exports.authDataModel = mongoose_1.default.model('authData', exports.authDataSchema);
exports.emailSendModel = mongoose_1.default.model('emailSend', exports.emailSendSchema);
exports.codeConfirmModel = mongoose_1.default.model('confirmAttemptLog', exports.codeConfirmSchema);
exports.refreshTokenModel = mongoose_1.default.model('refreshToken', exports.refreshTokenSchema);
exports.recoveryPasswordModel = mongoose_1.default.model('recoveryPassword', exports.recoveryPasswordSchema);
exports.newPasswordModel = mongoose_1.default.model('newPassword', exports.newPasswordSchema);
//# sourceMappingURL=db.js.map