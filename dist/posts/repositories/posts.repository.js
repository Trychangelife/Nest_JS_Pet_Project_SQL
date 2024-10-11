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
exports.PostRepository = exports.commentsVievModel = exports.postViewModel = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
exports.postViewModel = {
    _id: 0,
    id: 1,
    title: 1,
    shortDescription: 1,
    content: 1,
    blogId: 1,
    blogName: 1,
    createdAt: 1,
    extendedLikesInfo: 1
};
exports.commentsVievModel = {
    _id: 0,
    id: 1,
    content: 1,
    commentatorInfo: { userId: 1, userLogin: 1 },
    createdAt: 1,
    likesInfo: 1,
};
let PostRepository = class PostRepository {
    constructor(postsModel, bloggerModel, commentsModel, usersModel) {
        this.postsModel = postsModel;
        this.bloggerModel = bloggerModel;
        this.commentsModel = commentsModel;
        this.usersModel = usersModel;
    }
    async allPosts(skip, limit, page, userId) {
        const totalCount = await this.postsModel.countDocuments({});
        const pagesCount = Math.ceil(totalCount / limit);
        const cursor = await this.postsModel.find({}, exports.postViewModel).skip(skip).limit(limit);
        const arrayForReturn = [];
        const targetPostWithAggregation = await this.postsModel.aggregate([{
                $project: { _id: 0, id: 1, title: 1, shortDescription: 1, content: 1, blogId: 1, blogName: 1, createdAt: 1, extendedLikesInfo: { likesCount: 1, dislikesCount: 1, myStatus: 1, newestLikes: { addedAt: 1, userId: 1, login: 1 } } }
            }
        ]);
        for (let index = 0; index < targetPostWithAggregation.length; index++) {
            let post = Object.assign(Object.assign({}, targetPostWithAggregation[index]), { extendedLikesInfo: Object.assign(Object.assign({}, targetPostWithAggregation[index].extendedLikesInfo), { newestLikes: targetPostWithAggregation[index].extendedLikesInfo.newestLikes.reverse().slice(0, 3) }) });
            const checkOnDislike = await this.postsModel.findOne({ $and: [{ id: post.id }, { "dislikeStorage.userId": userId }] }).lean();
            const checkOnLike = await this.postsModel.findOne({ $and: [{ id: post.id }, { "extendedLikesInfo.newestLikes.userId": userId }] }).lean();
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
            post.extendedLikesInfo.myStatus = myStatus;
            arrayForReturn.push(post);
        }
        return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: arrayForReturn.reverse() };
    }
    async targetPosts(postId, userId, description) {
        if (description === "full") {
            return await this.postsModel.findOne({ id: postId }).lean();
        }
        const targetPost = await this.postsModel.findOne({ id: postId }, exports.postViewModel);
        const checkOnDislike = (await this.postsModel.findOne({ $and: [{ id: postId }, { "dislikeStorage.userId": userId }] }).lean());
        const checkOnLike = (await this.postsModel.findOne({ $and: [{ id: postId }, { "extendedLikesInfo.newestLikes.userId": userId }] }).lean());
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
        const targetPostWithAggregation = await this.postsModel.aggregate([{
                $project: { _id: 0, id: 1, title: 1, shortDescription: 1, content: 1, blogId: 1, blogName: 1, createdAt: 1, extendedLikesInfo: { likesCount: 1, dislikesCount: 1, myStatus: myStatus, newestLikes: { addedAt: 1, userId: 1, login: 1 } } }
            }
        ]).match({ id: postId });
        if (targetPostWithAggregation == null) {
            return undefined;
        }
        else {
            try {
                return Object.assign(Object.assign({}, targetPostWithAggregation[0]), { extendedLikesInfo: Object.assign(Object.assign({}, targetPostWithAggregation[0].extendedLikesInfo), { newestLikes: targetPostWithAggregation[0].extendedLikesInfo.newestLikes.reverse().slice(0, 3) }) });
            }
            catch (_a) {
                return targetPostWithAggregation[0];
            }
        }
    }
    async allPostsSpecificBlogger(blogId, skip, pageSize, page, userId) {
        const totalCount = await this.postsModel.countDocuments({ blogId: blogId });
        const checkBloggerExist = await this.bloggerModel.countDocuments({ id: blogId });
        if (checkBloggerExist < 1) {
            return undefined;
        }
        if (page !== undefined && pageSize !== undefined) {
            const postsBloggerWithPaginator = await this.postsModel.find({ blogId: blogId }, exports.postViewModel).skip(skip).limit(pageSize).lean();
            const pagesCount = Math.ceil(totalCount / pageSize);
            const arrayForReturn = [];
            const targetPostWithAggregation = await this.postsModel.aggregate([{
                    $project: { _id: 0, id: 1, title: 1, shortDescription: 1, content: 1, blogId: 1, blogName: 1, createdAt: 1, extendedLikesInfo: { likesCount: 1, dislikesCount: 1, myStatus: 1, newestLikes: { addedAt: 1, userId: 1, login: 1 } } }
                }
            ]).match({ blogId: blogId });
            for (let index = 0; index < targetPostWithAggregation.length; index++) {
                let post = Object.assign(Object.assign({}, targetPostWithAggregation[index]), { extendedLikesInfo: Object.assign(Object.assign({}, targetPostWithAggregation[index].extendedLikesInfo), { newestLikes: targetPostWithAggregation[index].extendedLikesInfo.newestLikes.reverse().slice(0, 3) }) });
                const checkOnDislike = await this.postsModel.findOne({ $and: [{ id: post.id }, { "dislikeStorage.userId": userId }] }).lean();
                const checkOnLike = await this.postsModel.findOne({ $and: [{ id: post.id }, { "extendedLikesInfo.newestLikes.userId": userId }] }).lean();
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
                post.extendedLikesInfo.myStatus = myStatus;
                arrayForReturn.push(post);
            }
            if (page > 0 || pageSize > 0) {
                return { pagesCount, page: page, pageSize: pageSize, totalCount, items: arrayForReturn.reverse() };
            }
            else {
                const postsBloggerWithOutPaginator = await this.postsModel.find({ blogId: blogId }).lean();
                return { pagesCount: 0, page: page, pageSize: pageSize, totalCount, items: postsBloggerWithOutPaginator };
            }
        }
    }
    async releasePost(newPosts, blogId, bloggerIdUrl) {
        const findBlogger = await this.bloggerModel.countDocuments({ id: blogId });
        if (findBlogger < 1) {
            return "400";
        }
        await this.postsModel.create(newPosts);
        const result = await this.postsModel.findOne({ id: newPosts.id }, exports.postViewModel).lean();
        if (result !== null) {
            return result;
        }
        else {
            return "400";
        }
    }
    async changePost(postId, title, shortDescription, content, blogId) {
        const foundPost = await this.postsModel.findOne({ id: postId }, exports.postViewModel).lean();
        const foundBlogger = await this.bloggerModel.findOne({ id: blogId }).lean();
        if (foundPost !== null && foundBlogger !== null) {
            await this.postsModel.updateOne({ id: postId }, { $set: { title: title, shortDescription: shortDescription, content: content, } });
            return foundPost;
        }
        else if (foundBlogger == null) {
            return '400';
        }
        else {
            return "404";
        }
    }
    async deletePost(postId, blogId) {
        if (blogId || postId) {
            const byPostId = await this.postsModel.deleteOne({ id: postId });
            const byBlogId = await this.postsModel.deleteOne({ blogId: blogId });
            if (byBlogId.deletedCount === 1 || byPostId.deletedCount === 1) {
                return true;
            }
        }
        else {
            return false;
        }
    }
    async createCommentForSpecificPost(createdComment) {
        await this.commentsModel.create(createdComment);
        const foundNewPost = await this.commentsModel.findOne({ id: createdComment.id }, exports.commentsVievModel).lean();
        if (foundNewPost !== null) {
            return foundNewPost;
        }
        else {
            return false;
        }
    }
    async takeCommentByIdPost(postId, skip, limit, page, userId, sortBy, sortDirection) {
        const findPosts = await this.postsModel.findOne({ id: postId }).lean();
        const totalCount = await this.commentsModel.countDocuments({ postId: postId });
        const pagesCount = Math.ceil(totalCount / limit);
        let ascOrDesc = -1;
        if (sortDirection === 'asc') {
            ascOrDesc = 1;
        }
        if (findPosts !== null) {
            const findComments = await this.commentsModel.find({ postId: postId }, exports.commentsVievModel).skip(skip).limit(limit).lean();
            const commentsWithAggregation = await this.commentsModel.aggregate([{
                    $project: { _id: 0, id: 1, content: 1, commentatorInfo: { userId: 1, userLogin: 1 }, createdAt: 1, postId: 1, likesInfo: 1 }
                }
            ]).sort({ createdAt: ascOrDesc }).match({ postId: postId });
            const commentsWithAggregation1 = await this.commentsModel.find({ postId: postId }, exports.commentsVievModel).skip(skip).limit(limit).lean().sort({ createdAt: ascOrDesc });
            const arrayForReturn = [];
            const arrayForReturn2 = [];
            for (let index = 0; index < commentsWithAggregation1.length; index++) {
                let comment = Object.assign(Object.assign({}, commentsWithAggregation1[index]), { likesInfo: Object.assign({}, commentsWithAggregation[index].likesInfo) });
                const checkOnDislike = await this.commentsModel.findOne({ $and: [{ id: comment.id }, { "dislikeStorage.userId": userId }] }).lean();
                const checkOnLike = await this.commentsModel.findOne({ $and: [{ id: comment.id }, { "likeStorage.userId": userId }] }).lean();
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
                comment.likesInfo.myStatus = myStatus;
                delete comment.postId;
                arrayForReturn.push(comment);
            }
            return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: arrayForReturn };
        }
        else {
            return false;
        }
    }
    async like_dislike(postId, likeStatus, userId, login) {
        const foundPost = await this.postsModel.findOne({ id: postId }, exports.postViewModel).lean();
        const foundUser = await this.usersModel.findOne({ id: userId }).lean();
        try {
            const likesCountPlusLike = foundPost.extendedLikesInfo.likesCount + 1;
            const likesCountMinusLike = foundPost.extendedLikesInfo.likesCount - 1;
            const dislikesCountPlusLike = foundPost.extendedLikesInfo.dislikesCount + 1;
            const dislikesCountMinusDislike = foundPost.extendedLikesInfo.dislikesCount - 1;
            const keys = Object.keys(likeStatus);
            if (foundPost !== null && foundUser !== null && likeStatus === "Like") {
                const checkOnLike = await this.postsModel.find({ $and: [{ "extendedLikesInfo.newestLikes.userId": userId }, { id: postId }] }).lean();
                const howMuchLikes = await this.postsModel.find({ "extendedLikesInfo.newestLikes": [] }).countDocuments();
                const checkOnDislike = await this.postsModel.find({ $and: [{ "dislikeStorage.userId": userId }, { id: postId }] }).lean();
                if (checkOnDislike.length > 0) {
                    await this.postsModel.updateOne({ id: postId }, { $set: { "extendedLikesInfo.dislikesCount": dislikesCountMinusDislike } });
                    await this.postsModel.updateOne({ id: postId }, { $pull: { dislikeStorage: { userId } } });
                }
                if (checkOnLike.length > 0) {
                    return foundPost;
                }
                else {
                    await this.postsModel.updateOne({ id: postId }, { $set: { "extendedLikesInfo.likesCount": likesCountPlusLike } });
                    await this.postsModel.findOneAndUpdate({ id: postId }, { $push: { "extendedLikesInfo.newestLikes": { addedAt: new Date(), userId: userId, login: login } } });
                    await this.postsModel.findOneAndUpdate({ id: postId }, { $push: { likeStorage: { addedAt: new Date(), userId: userId, login: login } } });
                    return foundPost;
                }
            }
            else if (foundPost !== null && foundUser !== null && likeStatus === "Dislike") {
                const checkOnDislike = await this.postsModel.find({ $and: [{ "dislikeStorage.userId": userId }, { id: postId }] }).lean();
                const checkOnLike = await this.postsModel.find({ $and: [{ "extendedLikesInfo.newestLikes.userId": userId }, { id: postId }] }).lean();
                if (checkOnLike.length > 0) {
                    await this.postsModel.updateOne({ id: postId }, { $set: { "extendedLikesInfo.likesCount": likesCountMinusLike } });
                    await this.postsModel.updateOne({ id: postId }, { $pull: { "extendedLikesInfo.newestLikes": { userId } } });
                    await this.postsModel.updateOne({ id: postId }, { $pull: { likeStorage: { userId } } });
                }
                if (checkOnDislike.length > 0) {
                    return foundPost;
                }
                else {
                    await this.postsModel.updateOne({ id: postId }, { $set: { "extendedLikesInfo.dislikesCount": dislikesCountPlusLike } });
                    await this.postsModel.findOneAndUpdate({ id: postId }, { $push: { dislikeStorage: { addedAt: new Date(), userId: userId, login: login } } });
                    return foundPost;
                }
            }
            else if (foundPost !== null && foundUser !== null && likeStatus === "None") {
                const checkOnDislike = await this.postsModel.find({ $and: [{ "dislikeStorage.userId": userId }, { id: postId }] }).lean();
                const checkOnLike = await this.postsModel.find({ $and: [{ "likeStorage.userId": userId }, { id: postId }] }).lean();
                if (checkOnLike.length > 0) {
                    await this.postsModel.updateOne({ id: postId }, { $set: { "extendedLikesInfo.likesCount": likesCountMinusLike } });
                    await this.postsModel.updateOne({ id: postId }, { $pull: { "extendedLikesInfo.newestLikes": { userId } } });
                    await this.postsModel.updateOne({ id: postId }, { $pull: { likeStorage: { userId } } });
                    return foundPost;
                }
                else if (checkOnDislike.length > 0) {
                    await this.postsModel.updateOne({ id: postId }, { $set: { "extendedLikesInfo.dislikesCount": dislikesCountMinusDislike } });
                    await this.postsModel.updateOne({ id: postId }, { $pull: { dislikeStorage: { userId } } });
                    return foundPost;
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
exports.PostRepository = PostRepository;
exports.PostRepository = PostRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Posts')),
    __param(1, (0, mongoose_1.InjectModel)('Blogs')),
    __param(2, (0, mongoose_1.InjectModel)('Comments')),
    __param(3, (0, mongoose_1.InjectModel)('Users')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PostRepository);
//# sourceMappingURL=posts.repository.js.map