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
exports.GetAllPostsSpecificBlogUseCase = exports.GetAllPostsSpecificBlogCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const posts_repository_1 = require("../../repositories/posts.repository");
class GetAllPostsSpecificBlogCommand {
    constructor(bloggerId, page, pageSize, userId) {
        this.bloggerId = bloggerId;
        this.page = page;
        this.pageSize = pageSize;
        this.userId = userId;
    }
}
exports.GetAllPostsSpecificBlogCommand = GetAllPostsSpecificBlogCommand;
let GetAllPostsSpecificBlogUseCase = class GetAllPostsSpecificBlogUseCase {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async execute(command) {
        let skip = 0;
        if (command.page && command.pageSize) {
            skip = (command.page - 1) * command.pageSize;
        }
        return await this.postsRepository.allPostsSpecificBlogger(command.bloggerId, skip, command.pageSize, command.page, command.userId);
    }
};
exports.GetAllPostsSpecificBlogUseCase = GetAllPostsSpecificBlogUseCase;
exports.GetAllPostsSpecificBlogUseCase = GetAllPostsSpecificBlogUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(GetAllPostsSpecificBlogCommand),
    __metadata("design:paramtypes", [posts_repository_1.PostRepository])
], GetAllPostsSpecificBlogUseCase);
//# sourceMappingURL=get_all_posts_specific_blog.js.map