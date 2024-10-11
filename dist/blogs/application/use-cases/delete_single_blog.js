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
exports.DeleteBlogUseCase = exports.DeleteBlogCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const blogs_repository_1 = require("../../repositories/blogs.repository");
class DeleteBlogCommand {
    constructor(id) {
        this.id = id;
    }
}
exports.DeleteBlogCommand = DeleteBlogCommand;
let DeleteBlogUseCase = class DeleteBlogUseCase {
    constructor(bloggerRepository) {
        this.bloggerRepository = bloggerRepository;
    }
    async execute(command) {
        const result = await this.bloggerRepository.deleteBlogger(command.id);
        if (result == true) {
            return "204";
        }
        else {
            return "404";
        }
    }
};
exports.DeleteBlogUseCase = DeleteBlogUseCase;
exports.DeleteBlogUseCase = DeleteBlogUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(DeleteBlogCommand),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository])
], DeleteBlogUseCase);
//# sourceMappingURL=delete_single_blog.js.map