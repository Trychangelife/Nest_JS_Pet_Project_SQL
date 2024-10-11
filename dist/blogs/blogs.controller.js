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
exports.BlogsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../guards/jwt.service");
const basic_auth_guard_1 = require("../guards/basic_auth_guard");
const pagination_constructor_1 = require("../utils/pagination.constructor");
const PostTypeValidator_1 = require("../posts/dto/PostTypeValidator");
const exception_filter_1 = require("../exception_filters/exception_filter");
const cqrs_1 = require("@nestjs/cqrs");
const get_all_blogs_1 = require("./application/use-cases/get_all_blogs");
const get_target_blog_1 = require("./application/use-cases/get_target_blog");
const create_blog_1 = require("./application/use-cases/create_blog");
const update_blog_1 = require("./application/use-cases/update_blog");
const delete_single_blog_1 = require("./application/use-cases/delete_single_blog");
const Blog_validator_type_1 = require("./dto/Blog_validator_type");
const get_all_posts_specific_blog_1 = require("../posts/application/use-cases/get_all_posts_specific_blog");
const create_post_1 = require("../posts/application/use-cases/create_post");
let BlogsController = class BlogsController {
    constructor(jwtServiceClass, commandBus) {
        this.jwtServiceClass = jwtServiceClass;
        this.commandBus = commandBus;
    }
    async getAllBloggers(query) {
        const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;
        const paginationData = (0, pagination_constructor_1.constructorPagination)(query.pageSize, query.pageNumber, query.sortBy, query.sortDirection);
        const full = await this.commandBus.execute(new get_all_blogs_1.GetAllBlogsCommand(paginationData.pageSize, paginationData.pageNumber, searchNameTerm, paginationData.sortBy, paginationData.sortDirection));
        return full;
    }
    async getBloggerById(id) {
        const findBlogger = await this.commandBus.execute(new get_target_blog_1.GetTargetBlogCommand(id));
        if (findBlogger !== undefined) {
            return findBlogger;
        }
        else {
            throw new common_1.HttpException('Blog not found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getPostByBloggerID(query, params, req) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const userId = await this.jwtServiceClass.getUserByAccessToken(token);
            const paginationData = (0, pagination_constructor_1.constructorPagination)(query.PageSize, query.PageNumber, query.sortBy, query.sortDirection);
            const findBlogger = await this.commandBus.execute(new get_all_posts_specific_blog_1.GetAllPostsSpecificBlogCommand(params.bloggerId, paginationData.pageNumber, paginationData.pageSize, userId));
            if (findBlogger !== undefined) {
                return findBlogger;
            }
            else {
                throw new common_1.HttpException('Post NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            const paginationData = (0, pagination_constructor_1.constructorPagination)(query.PageSize, query.PageNumber, query.sortBy, query.sortDirection);
            const findBlogger = await this.commandBus.execute(new get_all_posts_specific_blog_1.GetAllPostsSpecificBlogCommand(params.bloggerId, paginationData.pageNumber, paginationData.pageSize));
            if (findBlogger !== undefined) {
                return findBlogger;
            }
            else {
                throw new common_1.HttpException('Post NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            }
        }
    }
    async createBlogger(blogsType) {
        const createrPerson = await this.commandBus.execute(new create_blog_1.CreateBlogCommand(blogsType.name, blogsType.websiteUrl, blogsType.description));
        if (createrPerson !== null) {
            return createrPerson;
        }
        else {
            throw new common_1.HttpException('Opps check input Data', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createPostByBloggerId(params, post) {
        const blogger = await this.commandBus.execute(new get_target_blog_1.GetTargetBlogCommand(params.id));
        if (blogger == undefined || blogger == null) {
            throw new common_1.HttpException('Blogger NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
        const createPostForSpecificBlogger = await this.commandBus.execute(new create_post_1.CreatePostCommand(post.title, post.content, post.shortDescription, post.blogId, params.id));
        return createPostForSpecificBlogger;
    }
    async updateBlogger(params, blogsType) {
        const alreadyChanges = await this.commandBus.execute(new update_blog_1.UpdateBlogCommand(params.id, blogsType.name, blogsType.websiteUrl, blogsType.description));
        console.log(params.id, blogsType.name, blogsType.websiteUrl);
        if (alreadyChanges === 'update') {
            throw new common_1.HttpException('Update succefully', common_1.HttpStatus.NO_CONTENT);
        }
        else if (alreadyChanges === "404") {
            throw new common_1.HttpException('Blogger NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async deleteOneBlogger(params) {
        const afterDelete = await this.commandBus.execute(new delete_single_blog_1.DeleteBlogCommand(params.id));
        if (afterDelete === "204") {
            throw new common_1.HttpException('Delete succefully', common_1.HttpStatus.NO_CONTENT);
        }
        else {
            throw new common_1.HttpException('Blogger NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.BlogsController = BlogsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getAllBloggers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getBloggerById", null);
__decorate([
    (0, common_1.Get)(':bloggerId/posts'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getPostByBloggerID", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Blog_validator_type_1.Blogs]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "createBlogger", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Post)(':id/posts'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PostTypeValidator_1.PostTypeValidator]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "createPostByBloggerId", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Blog_validator_type_1.Blogs]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "updateBlogger", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "deleteOneBlogger", null);
exports.BlogsController = BlogsController = __decorate([
    (0, common_1.Controller)('blogs'),
    __metadata("design:paramtypes", [jwt_service_1.JwtServiceClass,
        cqrs_1.CommandBus])
], BlogsController);
//# sourceMappingURL=blogs.controller.js.map