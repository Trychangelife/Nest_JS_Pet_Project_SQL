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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindingBlogSuperAdminUseCase = exports.BindingBlogSuperAdminCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const blogs_SA_repository_1 = require("../repositories/blogs.SA.repository");
const Get_user_by_id_1 = require("../../../users/application/use-cases/Get_user_by_id");
class BindingBlogSuperAdminCommand {
    constructor(blogId, userId) {
        this.blogId = blogId;
        this.userId = userId;
    }
}
exports.BindingBlogSuperAdminCommand = BindingBlogSuperAdminCommand;
let BindingBlogSuperAdminUseCase = class BindingBlogSuperAdminUseCase {
    constructor(blogsSuperAdminRepository, commandBus) {
        this.blogsSuperAdminRepository = blogsSuperAdminRepository;
        this.commandBus = commandBus;
    }
    async execute(command) {
        const user = await this.commandBus.execute(new Get_user_by_id_1.GetUserByUserIdCommand(command.userId));
        return this.blogsSuperAdminRepository.BindingBlogToUserById(command.blogId, command.userId, user);
    }
};
exports.BindingBlogSuperAdminUseCase = BindingBlogSuperAdminUseCase;
exports.BindingBlogSuperAdminUseCase = BindingBlogSuperAdminUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(BindingBlogSuperAdminCommand),
    __metadata("design:paramtypes", [blogs_SA_repository_1.BlogsSuperAdminRepository, cqrs_1.CommandBus])
], BindingBlogSuperAdminUseCase);
//# sourceMappingURL=binding_blog.js.map