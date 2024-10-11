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
exports.GetTargetBlogUseCase = exports.GetTargetBlogCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const blogs_repository_1 = require("../../repositories/blogs.repository");
class GetTargetBlogCommand {
    constructor(blogId, userId) {
        this.blogId = blogId;
        this.userId = userId;
    }
}
exports.GetTargetBlogCommand = GetTargetBlogCommand;
let GetTargetBlogUseCase = class GetTargetBlogUseCase {
    constructor(bloggerRepository) {
        this.bloggerRepository = bloggerRepository;
    }
    async execute(command) {
        return this.bloggerRepository.targetBloggers(command.blogId, command.userId);
    }
};
exports.GetTargetBlogUseCase = GetTargetBlogUseCase;
exports.GetTargetBlogUseCase = GetTargetBlogUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(GetTargetBlogCommand),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository])
], GetTargetBlogUseCase);
//# sourceMappingURL=get_target_blog.js.map