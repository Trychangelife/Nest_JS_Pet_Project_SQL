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
exports.SuperAdminBlogsController = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const pagination_constructor_1 = require("../../utils/pagination.constructor");
const get_all_blogs_1 = require("./application/get_all_blogs");
const basic_auth_guard_1 = require("../../guards/basic_auth_guard");
const exception_filter_1 = require("../../exception_filters/exception_filter");
const binding_blog_1 = require("./application/binding_blog");
const get_target_blog_1 = require("../../blogs/application/use-cases/get_target_blog");
let SuperAdminBlogsController = class SuperAdminBlogsController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async getAllBlogs(query) {
        const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;
        const paginationData = (0, pagination_constructor_1.constructorPagination)(query.pageSize, query.pageNumber, query.sortBy, query.sortDirection);
        const allBlogsHowSuperAdmin = await this.commandBus.execute(new get_all_blogs_1.GetAllBlogsSuperAdminCommand(paginationData.pageSize, paginationData.pageNumber, searchNameTerm, paginationData.sortBy, paginationData.sortDirection));
        return allBlogsHowSuperAdmin;
    }
    async updateBlogger(params) {
        const getBlog = await this.commandBus.execute(new get_target_blog_1.GetTargetBlogCommand(params.id));
        if (getBlog == true) {
            if (getBlog.blogOwnerInfo.userId !== null) {
                await this.commandBus.execute(new binding_blog_1.BindingBlogSuperAdminCommand(params.id, params.userId));
                throw new common_1.HttpException('Binding succefully', common_1.HttpStatus.NO_CONTENT);
            }
            else {
                throw new common_1.HttpException('Blogs already binding', common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
};
exports.SuperAdminBlogsController = SuperAdminBlogsController;
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminBlogsController.prototype, "getAllBlogs", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Put)(':id/bind-with-user/:userId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminBlogsController.prototype, "updateBlogger", null);
exports.SuperAdminBlogsController = SuperAdminBlogsController = __decorate([
    (0, common_1.Controller)('sa/blogs'),
    __metadata("design:paramtypes", [cqrs_1.CommandBus])
], SuperAdminBlogsController);
//# sourceMappingURL=sa.blog.controller.js.map