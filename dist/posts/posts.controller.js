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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const basic_auth_guard_1 = require("../guards/basic_auth_guard");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const jwt_service_1 = require("../guards/jwt.service");
const pagination_constructor_1 = require("../utils/pagination.constructor");
const types_1 = require("../utils/types");
const posts_service_1 = require("./application/posts.service");
const exception_filter_1 = require("../exception_filters/exception_filter");
const Comment_validator_type_1 = require("../comments/dto/Comment_validator_type");
const PostTypeValidator_1 = require("./dto/PostTypeValidator");
const cqrs_1 = require("@nestjs/cqrs");
const get_all_posts_1 = require("./application/use-cases/get_all_posts");
const get_single_post_1 = require("./application/use-cases/get_single_post");
const create_post_1 = require("./application/use-cases/create_post");
const update_post_1 = require("./application/use-cases/update_post");
const delete_post_1 = require("./application/use-cases/delete_post");
const create_comment_for_specific_post_1 = require("./application/use-cases/create_comment_for_specific_post");
const get_comments_by_postID_1 = require("./application/use-cases/get_comments_by_postID");
const like_dislike_for_post_1 = require("./application/use-cases/like_dislike_for_post");
const check_banStatus_1 = require("../superAdmin/SAusers/application/useCases/check_banStatus");
let PostController = class PostController {
    constructor(postsService, jwtServiceClass, commandBus) {
        this.postsService = postsService;
        this.jwtServiceClass = jwtServiceClass;
        this.commandBus = commandBus;
    }
    async getAllPosts(query, req) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const userId = await this.jwtServiceClass.getUserByAccessToken(token);
            const paginationData = (0, pagination_constructor_1.constructorPagination)(query.pageSize, query.pageNumber, query.sortBy, query.sortDirection);
            const getAllPosts = await this.commandBus.execute(new get_all_posts_1.GetAllPostsCommand(paginationData.pageSize, paginationData.pageNumber, userId));
            return getAllPosts;
        }
        catch (error) {
            const paginationData = (0, pagination_constructor_1.constructorPagination)(query.pageSize, query.pageNumber, query.sortBy, query.sortDirection);
            const getAllPosts = await this.commandBus.execute(new get_all_posts_1.GetAllPostsCommand(paginationData.pageSize, paginationData.pageNumber));
            return getAllPosts;
        }
    }
    async getPostByID(params, req) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const userId = await this.jwtServiceClass.getUserByAccessToken(token);
            const takePost = await this.commandBus.execute(new get_single_post_1.GetSinglePostCommand(params.id, userId));
            const checkBan = await this.commandBus.execute(new check_banStatus_1.CheckBanStatusSuperAdminCommand(null, takePost === null || takePost === void 0 ? void 0 : takePost.blogId));
            if (takePost !== undefined) {
                return takePost;
            }
            else {
                throw new common_1.HttpException('Post NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            const takePost = await this.commandBus.execute(new get_single_post_1.GetSinglePostCommand(params.id));
            const checkBan = await this.commandBus.execute(new check_banStatus_1.CheckBanStatusSuperAdminCommand(null, takePost === null || takePost === void 0 ? void 0 : takePost.blogId));
            if (takePost !== undefined) {
                return takePost;
            }
            else {
                throw new common_1.HttpException('Post NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            }
        }
    }
    async createPost(post, res) {
        const createdPost = await this.commandBus.execute(new create_post_1.CreatePostCommand(post.title, post.content, post.shortDescription, post.userId, post.blogId));
        if (createdPost == null) {
            throw new common_1.HttpException('Something wrong, check input data', common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            res.status(201).send(createdPost);
        }
    }
    async updatePost(params, post, req) {
        const afterChanged = await this.commandBus.execute(new update_post_1.UpdatePostCommand(params.postId, post.title, post.shortDescription, post.content, post.blogId));
        if (afterChanged !== "404" && afterChanged !== '400') {
            throw new common_1.HttpException(afterChanged, common_1.HttpStatus.NO_CONTENT);
        }
        else if (afterChanged === "400") {
            throw new common_1.HttpException('Something wrong, check input data', common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            throw new common_1.HttpException('Post NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async deletePostById(params, res) {
        const deleteObj = await this.commandBus.execute(new delete_post_1.DeletePostCommand(params.id));
        if (deleteObj === true) {
            throw new common_1.HttpException('Post was DELETED', common_1.HttpStatus.NO_CONTENT);
        }
        else {
            throw new common_1.HttpException('Post NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async createCommentForPost(postId, content, req) {
        const newComment = await this.commandBus.execute(new create_comment_for_specific_post_1.CreateCommentForSpecificPostCommand(postId, content.content, req.user.id, req.user.login));
        if (newComment) {
            return newComment;
        }
        else {
            throw new common_1.HttpException('Post NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getCommentsByPostId(query, params, req) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const userId = await this.jwtServiceClass.getUserByAccessToken(token);
            const paginationData = (0, pagination_constructor_1.constructorPagination)(query.pageSize, query.pageNumber, query.sortBy, query.sortDirection);
            const newComment = await this.commandBus.execute(new get_comments_by_postID_1.GetCommentByPostIdCommand(params.postId, paginationData.pageNumber, paginationData.pageSize, userId, paginationData.sortBy, paginationData.sortDirection));
            if (newComment) {
                return newComment;
            }
            else {
                throw new common_1.HttpException("Post doesn't exists", common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            const paginationData = (0, pagination_constructor_1.constructorPagination)(query.pageSize, query.pageNumber, query.sortBy, query.sortDirection);
            const userIdMok = 'just';
            const newComment = await this.commandBus.execute(new get_comments_by_postID_1.GetCommentByPostIdCommand(params.postId, paginationData.pageNumber, paginationData.pageSize, userIdMok, paginationData.sortBy, paginationData.sortDirection));
            if (newComment) {
                return newComment;
            }
            else {
                throw new common_1.HttpException("Post doesn't exists", common_1.HttpStatus.NOT_FOUND);
            }
        }
    }
    async like_dislike(postId, likeStatus, req) {
        const like_dislike = await this.commandBus.execute(new like_dislike_for_post_1.LikeDislikeForPostCommand(postId, likeStatus, req.user.id, req.user.login));
        if (like_dislike !== "404" && like_dislike !== '400') {
            throw new common_1.HttpException(like_dislike, common_1.HttpStatus.NO_CONTENT);
        }
        else if (like_dislike === "400") {
            throw new common_1.HttpException({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            throw new common_1.HttpException('Post NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getAllPosts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getPostByID", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostTypeValidator_1.PostTypeValidatorForCreate, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createPost", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Put)(':postId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PostTypeValidator_1.PostTypeValidatorForCreate, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "updatePost", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "deletePostById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Post)(':postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Comment_validator_type_1.Comment, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "createCommentForPost", null);
__decorate([
    (0, common_1.Get)(':postId/comments'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "getCommentsByPostId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':postId/like-status'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)('likeStatus', new common_1.ParseEnumPipe(types_1.LIKES, {
        errorHttpStatusCode: common_1.HttpStatus.BAD_REQUEST,
        exceptionFactory: error => {
            throw new common_1.BadRequestException({
                errorsMessages: [{
                        message: error,
                        field: "likeStatus"
                    }]
            });
        }
    }))),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "like_dislike", null);
exports.PostController = PostController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService,
        jwt_service_1.JwtServiceClass,
        cqrs_1.CommandBus])
], PostController);
//# sourceMappingURL=posts.controller.js.map