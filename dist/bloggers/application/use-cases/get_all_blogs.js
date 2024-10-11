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
exports.GetAllBlogsforBloggerUseCase = exports.GetAllBlogsforBloggerCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const bloggers_repository_1 = require("../../repositories/bloggers.repository");
class GetAllBlogsforBloggerCommand {
    constructor(pageSize, pageNumber, searchNameTerm, sortBy, sortDirection, userId) {
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
        this.searchNameTerm = searchNameTerm;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
        this.userId = userId;
    }
}
exports.GetAllBlogsforBloggerCommand = GetAllBlogsforBloggerCommand;
let GetAllBlogsforBloggerUseCase = class GetAllBlogsforBloggerUseCase {
    constructor(bloggerRepository) {
        this.bloggerRepository = bloggerRepository;
    }
    async execute(command) {
        let skip = 0;
        if (command.pageNumber && command.pageSize) {
            skip = (command.pageNumber - 1) * command.pageSize;
        }
        const blogs = await this.bloggerRepository.getAllBlogsForSpecificBlogger(skip, command.pageSize, command.searchNameTerm, command.pageNumber, command.sortBy, command.sortDirection, command.userId);
        return blogs;
    }
};
exports.GetAllBlogsforBloggerUseCase = GetAllBlogsforBloggerUseCase;
exports.GetAllBlogsforBloggerUseCase = GetAllBlogsforBloggerUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(GetAllBlogsforBloggerCommand),
    __metadata("design:paramtypes", [bloggers_repository_1.BlogsByBloggerRepository])
], GetAllBlogsforBloggerUseCase);
//# sourceMappingURL=get_all_blogs.js.map