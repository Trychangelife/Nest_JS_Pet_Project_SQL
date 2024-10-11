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
exports.GetAllPostsUseCase = exports.GetAllPostsCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const posts_repository_1 = require("../../repositories/posts.repository");
class GetAllPostsCommand {
    constructor(pageSize, pageNumber, userId) {
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
        this.userId = userId;
    }
}
exports.GetAllPostsCommand = GetAllPostsCommand;
let GetAllPostsUseCase = class GetAllPostsUseCase {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async execute(command) {
        let skip = 0;
        if (command.pageNumber && command.pageSize) {
            skip = (command.pageNumber - 1) * command.pageSize;
        }
        return this.postsRepository.allPosts(skip, command.pageSize, command.pageNumber, command.userId);
    }
};
exports.GetAllPostsUseCase = GetAllPostsUseCase;
exports.GetAllPostsUseCase = GetAllPostsUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(GetAllPostsCommand),
    __metadata("design:paramtypes", [posts_repository_1.PostRepository])
], GetAllPostsUseCase);
//# sourceMappingURL=get_all_posts.js.map