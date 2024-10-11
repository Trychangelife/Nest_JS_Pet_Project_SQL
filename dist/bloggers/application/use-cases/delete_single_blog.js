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
exports.DeleteBlogForSpecificBloggerUseCase = exports.DeleteBlogForSpecificBloggerCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const bloggers_repository_1 = require("../../repositories/bloggers.repository");
class DeleteBlogForSpecificBloggerCommand {
    constructor(blogId, userId) {
        this.blogId = blogId;
        this.userId = userId;
    }
}
exports.DeleteBlogForSpecificBloggerCommand = DeleteBlogForSpecificBloggerCommand;
let DeleteBlogForSpecificBloggerUseCase = class DeleteBlogForSpecificBloggerUseCase {
    constructor(bloggerRepository) {
        this.bloggerRepository = bloggerRepository;
    }
    async execute(command) {
        const result = await this.bloggerRepository.deleteBlogForSpecificBlogger(command.blogId, command.userId);
        return result;
    }
};
exports.DeleteBlogForSpecificBloggerUseCase = DeleteBlogForSpecificBloggerUseCase;
exports.DeleteBlogForSpecificBloggerUseCase = DeleteBlogForSpecificBloggerUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(DeleteBlogForSpecificBloggerCommand),
    __metadata("design:paramtypes", [bloggers_repository_1.BlogsByBloggerRepository])
], DeleteBlogForSpecificBloggerUseCase);
//# sourceMappingURL=delete_single_blog.js.map