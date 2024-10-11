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
exports.LikeDislikeForPostUseCase = exports.LikeDislikeForPostCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const posts_repository_1 = require("../../repositories/posts.repository");
class LikeDislikeForPostCommand {
    constructor(postId, likeStatus, userId, login) {
        this.postId = postId;
        this.likeStatus = likeStatus;
        this.userId = userId;
        this.login = login;
    }
}
exports.LikeDislikeForPostCommand = LikeDislikeForPostCommand;
let LikeDislikeForPostUseCase = class LikeDislikeForPostUseCase {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async execute(command) {
        return await this.postsRepository.like_dislike(command.postId, command.likeStatus, command.userId, command.login);
    }
};
exports.LikeDislikeForPostUseCase = LikeDislikeForPostUseCase;
exports.LikeDislikeForPostUseCase = LikeDislikeForPostUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(LikeDislikeForPostCommand),
    __metadata("design:paramtypes", [posts_repository_1.PostRepository])
], LikeDislikeForPostUseCase);
//# sourceMappingURL=like_dislike_for_post.js.map