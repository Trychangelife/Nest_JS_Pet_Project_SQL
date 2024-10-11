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
exports.BloggersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../guards/jwt.service");
const pagination_constructor_1 = require("../utils/pagination.constructor");
const PostTypeValidator_1 = require("../posts/dto/PostTypeValidator");
const exception_filter_1 = require("../exception_filters/exception_filter");
const cqrs_1 = require("@nestjs/cqrs");
const create_blog_1 = require("./application/use-cases/create_blog");
const Blog_validator_type_1 = require("../blogs/dto/Blog_validator_type");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const Get_user_by_id_1 = require("../users/application/use-cases/Get_user_by_id");
const get_all_blogs_1 = require("./application/use-cases/get_all_blogs");
const delete_single_blog_1 = require("./application/use-cases/delete_single_blog");
const get_target_blog_1 = require("../blogs/application/use-cases/get_target_blog");
const create_Post_1 = require("./application/use-cases/create_Post");
const update_blog_1 = require("./application/use-cases/update_blog");
const delete_post_by_id_1 = require("./application/use-cases/delete_post_by_id");
const get_single_post_1 = require("../posts/application/use-cases/get_single_post");
const check_forbidden_1 = require("../posts/application/use-cases/check_forbidden");
const update_post_1 = require("../posts/application/use-cases/update_post");
let BloggersController = class BloggersController {
    constructor(jwtServiceClass, commandBus) {
        this.jwtServiceClass = jwtServiceClass;
        this.commandBus = commandBus;
    }
    async getAllBloggers(query, req) {
        const token = req.headers.authorization.split(' ')[1];
        const userId = await this.jwtServiceClass.getUserByAccessToken(token);
        const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;
        const paginationData = (0, pagination_constructor_1.constructorPagination)(query.pageSize, query.pageNumber, query.sortBy, query.sortDirection);
        const full = await this.commandBus.execute(new get_all_blogs_1.GetAllBlogsforBloggerCommand(paginationData.pageSize, paginationData.pageNumber, searchNameTerm, paginationData.sortBy, paginationData.sortDirection, userId));
        return full;
    }
    async createBlogger(blogsType, req) {
        const token = req.headers.authorization.split(' ')[1];
        const userId = await this.jwtServiceClass.getUserByAccessToken(token);
        const user = await this.commandBus.execute(new Get_user_by_id_1.GetUserByUserIdCommand(userId));
        const createrPerson = await this.commandBus.execute(new create_blog_1.CreateBlogByBloggerCommand(blogsType.name, blogsType.websiteUrl, blogsType.description, userId, user.login));
        if (createrPerson !== null) {
            return createrPerson;
        }
        else {
            throw new common_1.HttpException('Opps check input Data', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createPostByBloggerId(params, post, req) {
        const token = req.headers.authorization.split(' ')[1];
        const userId = await this.jwtServiceClass.getUserByAccessToken(token);
        const blogWithUserId = await this.commandBus.execute(new get_target_blog_1.GetTargetBlogCommand(params.blogId, userId));
        const blogWithBlogId = await this.commandBus.execute(new get_target_blog_1.GetTargetBlogCommand(params.blogId, null));
        if (!blogWithBlogId) {
            throw new common_1.HttpException('Check URI param, blog not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (userId !== (blogWithUserId === null || blogWithUserId === void 0 ? void 0 : blogWithUserId.blogOwnerInfo.userId)) {
            throw new common_1.HttpException('Access denied', common_1.HttpStatus.FORBIDDEN);
        }
        if (!blogWithUserId) {
            throw new common_1.HttpException('Blog NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
        const createPostForSpecificBlogger = await this.commandBus.execute(new create_Post_1.CreatePostByBloggerCommand(post.title, post.content, post.shortDescription, params.blogId));
        return createPostForSpecificBlogger;
    }
    async updateBlogger(params, blogsType, req) {
        const token = req.headers.authorization.split(' ')[1];
        const userId = await this.jwtServiceClass.getUserByAccessToken(token);
        const blogWithUserId = await this.commandBus.execute(new get_target_blog_1.GetTargetBlogCommand(null, userId));
        const blogWithBlogId = await this.commandBus.execute(new get_target_blog_1.GetTargetBlogCommand(params.id, null));
        if (!blogWithUserId) {
            throw new common_1.HttpException('Access denied', common_1.HttpStatus.FORBIDDEN);
        }
        if (!blogWithBlogId) {
            throw new common_1.HttpException('Blog NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
        const alreadyChanges = await this.commandBus.execute(new update_blog_1.UpdateBlogByBloggerCommand(params.id, blogsType.name, blogsType.websiteUrl, blogsType.description));
        throw new common_1.HttpException(alreadyChanges, common_1.HttpStatus.NO_CONTENT);
    }
    async updatePost(params, postInput, req) {
        const token = req.headers.authorization.split(' ')[1];
        const userId = await this.jwtServiceClass.getUserByAccessToken(token);
        const foundPost = await this.commandBus.execute(new get_single_post_1.GetSinglePostCommand(params.postId));
        if (!foundPost) {
            throw new common_1.HttpException('Post NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
        const blogWithBlogId = await this.commandBus.execute(new get_target_blog_1.GetTargetBlogCommand(params.blogId, null));
        if (!blogWithBlogId) {
            throw new common_1.HttpException('Blog NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
        const checkForbidden = await this.commandBus.execute(new check_forbidden_1.CheckForbiddenCommand(params.postId, userId));
        if (checkForbidden == false) {
            throw new common_1.HttpException('Access denied', common_1.HttpStatus.FORBIDDEN);
        }
        const alreadyChanges = await this.commandBus.execute(new update_post_1.UpdatePostCommand(params.postId, postInput.title, postInput.shortDescription, postInput.content, params.blogId));
        throw new common_1.HttpException(alreadyChanges, common_1.HttpStatus.NO_CONTENT);
    }
    async deleteOneBlog(params, req) {
        const token = req.headers.authorization.split(' ')[1];
        const userId = await this.jwtServiceClass.getUserByAccessToken(token);
        const blogWithUserId = await this.commandBus.execute(new get_target_blog_1.GetTargetBlogCommand(null, userId));
        const blogWithBlogId = await this.commandBus.execute(new get_target_blog_1.GetTargetBlogCommand(params.id, null));
        if (!blogWithUserId) {
            throw new common_1.HttpException('Access denied', common_1.HttpStatus.FORBIDDEN);
        }
        if (!blogWithBlogId) {
            throw new common_1.HttpException('Blog NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
        const afterDelete = await this.commandBus.execute(new delete_single_blog_1.DeleteBlogForSpecificBloggerCommand(params.id, userId));
        if (afterDelete) {
            throw new common_1.HttpException('Delete succefully', common_1.HttpStatus.NO_CONTENT);
        }
        else {
            throw new common_1.HttpException('Blogger NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async deletePostById(params, req) {
        const token = req.headers.authorization.split(' ')[1];
        const userId = await this.jwtServiceClass.getUserByAccessToken(token);
        const targetPost = await this.commandBus.execute(new get_single_post_1.GetSinglePostCommand(params.postId, userId));
        if (targetPost == null || targetPost == undefined) {
            throw new common_1.HttpException('Post Not Found', common_1.HttpStatus.NOT_FOUND);
        }
        const checkForbidden = await this.commandBus.execute(new check_forbidden_1.CheckForbiddenCommand(params.postId, userId));
        if (checkForbidden == false) {
            throw new common_1.HttpException('Access denied', common_1.HttpStatus.FORBIDDEN);
        }
        const deleteObj = await this.commandBus.execute(new delete_post_by_id_1.DeletePostByBloggerCommand(params.blogId, params.postId));
        if (deleteObj === true) {
            throw new common_1.HttpException('Post was DELETED', common_1.HttpStatus.NO_CONTENT);
        }
        else {
            throw new common_1.HttpException('Post NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.BloggersController = BloggersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BloggersController.prototype, "getAllBloggers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Blog_validator_type_1.Blogs, Object]),
    __metadata("design:returntype", Promise)
], BloggersController.prototype, "createBlogger", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Post)(':blogId/posts'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PostTypeValidator_1.PostTypeValidator, Object]),
    __metadata("design:returntype", Promise)
], BloggersController.prototype, "createPostByBloggerId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Blog_validator_type_1.Blogs, Object]),
    __metadata("design:returntype", Promise)
], BloggersController.prototype, "updateBlogger", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Put)(':blogId/posts/:postId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PostTypeValidator_1.PostTypeValidator, Object]),
    __metadata("design:returntype", Promise)
], BloggersController.prototype, "updatePost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BloggersController.prototype, "deleteOneBlog", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':blogId/posts/:postId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BloggersController.prototype, "deletePostById", null);
exports.BloggersController = BloggersController = __decorate([
    (0, common_1.Controller)('blogger/blogs'),
    __metadata("design:paramtypes", [jwt_service_1.JwtServiceClass,
        cqrs_1.CommandBus])
], BloggersController);
//# sourceMappingURL=bloggers.controller.js.map