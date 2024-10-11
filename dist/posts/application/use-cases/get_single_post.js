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
exports.GetSinglePostUseCase = exports.GetSinglePostCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const posts_repository_1 = require("../../repositories/posts.repository");
class GetSinglePostCommand {
    constructor(postId, userId, description) {
        this.postId = postId;
        this.userId = userId;
        this.description = description;
    }
}
exports.GetSinglePostCommand = GetSinglePostCommand;
let GetSinglePostUseCase = class GetSinglePostUseCase {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async execute(command) {
        return await this.postsRepository.targetPosts(command.postId, command.userId, command.description);
    }
};
exports.GetSinglePostUseCase = GetSinglePostUseCase;
exports.GetSinglePostUseCase = GetSinglePostUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(GetSinglePostCommand),
    __metadata("design:paramtypes", [posts_repository_1.PostRepository])
], GetSinglePostUseCase);
//# sourceMappingURL=get_single_post.js.map