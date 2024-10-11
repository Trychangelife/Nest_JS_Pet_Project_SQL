"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const posts_repository_1 = require("../../posts/repositories/posts.repository");
let CommentsRepository = class CommentsRepository {
    constructor(commentsModel, usersModel) {
        this.commentsModel = commentsModel;
        this.usersModel = usersModel;
    }
    async commentsByUserId(commentId, userId) {
        const result = await this.commentsModel.findOne({ id: commentId }, posts_repository_1.commentsVievModel);
        const checkOnDislike = (await this.commentsModel.findOne({ $and: [{ id: commentId }, { "dislikeStorage.userId": userId }] }).lean());
        const checkOnLike = (await this.commentsModel.findOne({ $and: [{ id: commentId }, { "likeStorage.userId": userId }] }).lean());
        let myStatus = '';
        if (checkOnLike) {
            myStatus = "Like";
        }
        else if (checkOnDislike) {
            myStatus = "Dislike";
        }
        else {
            myStatus = "None";
        }
        const targetCommentWithAggregation = await this.commentsModel.aggregate([{
                $project: { _id: 0, id: 1, content: 1, commentatorInfo: { userId: 1, userLogin: 1 }, createdAt: 1, likesInfo: { likesCount: 1, dislikesCount: 1, myStatus: myStatus } }
            }
        ]).match({ id: commentId });
        if (targetCommentWithAggregation == null) {
            return null;
        }
        else {
            return targetCommentWithAggregation[0];
        }
    }
    async updateCommentByCommentId(commentId, content, userId) {
        const findTargetComment = await this.commentsModel.findOne({ id: commentId }, posts_repository_1.commentsVievModel).lean();
        if (findTargetComment !== null && findTargetComment.commentatorInfo.userId === userId) {
            await this.commentsModel.updateOne({ id: commentId }, { $set: { content: content } });
            return true;
        }
        if (findTargetComment == null) {
            return null;
        }
        else {
            return false;
        }
    }
    async deleteCommentByCommentId(commentId, userId) {
        const findTargetComment = await this.commentsModel.findOne({ id: commentId });
        if (findTargetComment !== null && findTargetComment.commentatorInfo.userId === userId) {
            await this.commentsModel.deleteOne({ id: commentId });
            return true;
        }
        if (findTargetComment == null) {
            return null;
        }
        else {
            return false;
        }
    }
    async like_dislike(commentId, likeStatus, userId, login) {
        const foundComment = await this.commentsModel.findOne({ id: commentId }, posts_repository_1.commentsVievModel).lean();
        const foundUser = await this.usersModel.findOne({ id: userId }).lean();
        try {
            const likesCountPlusLike = foundComment.likesInfo.likesCount + 1;
            const likesCountMinusLike = foundComment.likesInfo.likesCount - 1;
            const dislikesCountPlusLike = foundComment.likesInfo.dislikesCount + 1;
            const dislikesCountMinusDislike = foundComment.likesInfo.dislikesCount - 1;
            const keys = Object.keys(likeStatus);
            if (foundComment !== null && foundUser !== null && (likeStatus[keys[0]]) === "Like") {
                const checkOnLike = await this.commentsModel.find({ $and: [{ "likeStorage.userId": userId }, { id: commentId }] }).lean();
                const howMuchLikes = await this.commentsModel.find({ likeStorage: [] }).countDocuments();
                const checkOnDislike = await this.commentsModel.find({ $and: [{ "dislikeStorage.userId": userId }, { id: commentId }] }).lean();
                if (checkOnDislike.length > 0) {
                    await this.commentsModel.updateOne({ id: commentId }, { $set: { "likesInfo.dislikesCount": dislikesCountMinusDislike } });
                    await this.commentsModel.updateOne({ id: commentId }, { $pull: { dislikeStorage: { userId } } });
                }
                if (checkOnLike.length > 0) {
                    return foundComment;
                }
                else {
                    await this.commentsModel.updateOne({ id: commentId }, { $set: { "likesInfo.likesCount": likesCountPlusLike } });
                    await this.commentsModel.findOneAndUpdate({ id: commentId }, { $push: { likeStorage: { addedAt: new Date(), userId: userId, login: login } } });
                    return foundComment;
                }
            }
            else if (foundComment !== null && foundUser !== null && (likeStatus[keys[0]]) === "Dislike") {
                const checkOnDislike = await this.commentsModel.find({ $and: [{ "dislikeStorage.userId": userId }, { id: commentId }] }).lean();
                const checkOnLike = await this.commentsModel.find({ $and: [{ "likeStorage.userId": userId }, { id: commentId }] }).lean();
                if (checkOnLike.length > 0) {
                    await this.commentsModel.updateOne({ id: commentId }, { $set: { "likesInfo.likesCount": likesCountMinusLike } });
                    await this.commentsModel.updateOne({ id: commentId }, { $pull: { likeStorage: { userId } } });
                }
                if (checkOnDislike.length > 0) {
                    return foundComment;
                }
                else {
                    await this.commentsModel.updateOne({ id: commentId }, { $set: { "likesInfo.dislikesCount": dislikesCountPlusLike } });
                    await this.commentsModel.findOneAndUpdate({ id: commentId }, { $push: { dislikeStorage: { addedAt: new Date(), userId: userId, login: login } } });
                    return foundComment;
                }
            }
            else if (foundComment !== null && foundUser !== null && (likeStatus[keys[0]]) === "None") {
                const checkOnDislike = await this.commentsModel.find({ $and: [{ "dislikeStorage.userId": userId }, { id: commentId }] }).lean();
                const checkOnLike = await this.commentsModel.find({ $and: [{ "likeStorage.userId": userId }, { id: commentId }] }).lean();
                if (checkOnLike.length > 0) {
                    await this.commentsModel.updateOne({ id: commentId }, { $set: { "likesInfo.likesCount": likesCountMinusLike } });
                    await this.commentsModel.updateOne({ id: commentId }, { $pull: { likeStorage: { userId } } });
                    return foundComment;
                }
                else if (checkOnDislike.length > 0) {
                    await this.commentsModel.updateOne({ id: commentId }, { $set: { "likesInfo.dislikesCount": dislikesCountMinusDislike } });
                    await this.commentsModel.updateOne({ id: commentId }, { $pull: { dislikeStorage: { userId } } });
                    return foundComment;
                }
            }
            else if (foundUser == null) {
                return '400';
            }
            else {
                return "404";
            }
        }
        catch (error) {
            return "404";
        }
    }
};
exports.CommentsRepository = CommentsRepository;
exports.CommentsRepository = CommentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Comments')),
    __param(1, (0, mongoose_1.InjectModel)('Users')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CommentsRepository);
//# sourceMappingURL=comments.repository.js.map