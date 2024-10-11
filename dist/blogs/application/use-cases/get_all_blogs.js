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
exports.GetAllBlogsUseCase = exports.GetAllBlogsCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const blogs_repository_1 = require("../../repositories/blogs.repository");
class GetAllBlogsCommand {
    constructor(pageSize, pageNumber, searchNameTerm, sortBy, sortDirection) {
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
        this.searchNameTerm = searchNameTerm;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
    }
}
exports.GetAllBlogsCommand = GetAllBlogsCommand;
let GetAllBlogsUseCase = class GetAllBlogsUseCase {
    constructor(bloggerRepository) {
        this.bloggerRepository = bloggerRepository;
    }
    async execute(command) {
        let skip = 0;
        if (command.pageNumber && command.pageSize) {
            skip = (command.pageNumber - 1) * command.pageSize;
        }
        const blogs = await this.bloggerRepository.getAllBlogs(skip, command.pageSize, command.searchNameTerm, command.pageNumber, command.sortBy, command.sortDirection);
        return blogs;
    }
};
exports.GetAllBlogsUseCase = GetAllBlogsUseCase;
exports.GetAllBlogsUseCase = GetAllBlogsUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(GetAllBlogsCommand),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository])
], GetAllBlogsUseCase);
//# sourceMappingURL=get_all_blogs.js.map