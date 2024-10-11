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
exports.CreateBlogUseCase = exports.CreateBlogCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const blogs_repository_1 = require("../../repositories/blogs.repository");
const BlogsClass_1 = require("../../dto/BlogsClass");
const uuid_1 = require("uuid");
class CreateBlogCommand {
    constructor(name, websiteUrl, description) {
        this.name = name;
        this.websiteUrl = websiteUrl;
        this.description = description;
    }
}
exports.CreateBlogCommand = CreateBlogCommand;
let CreateBlogUseCase = class CreateBlogUseCase {
    constructor(bloggerRepository) {
        this.bloggerRepository = bloggerRepository;
    }
    async execute(command) {
        const newBlogs = new BlogsClass_1.BlogsClass((0, uuid_1.v4)(), command.name, command.description, command.websiteUrl, (new Date()).toISOString(), false, { userId: null, userLogin: null });
        const createdBlogs = await this.bloggerRepository.createBlogger(newBlogs);
        return createdBlogs;
    }
};
exports.CreateBlogUseCase = CreateBlogUseCase;
exports.CreateBlogUseCase = CreateBlogUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(CreateBlogCommand),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository])
], CreateBlogUseCase);
//# sourceMappingURL=create_blog.js.map