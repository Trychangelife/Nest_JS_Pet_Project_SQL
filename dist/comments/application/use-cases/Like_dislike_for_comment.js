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
exports.LikeDislikeCommentUseCase = exports.LikeDislikeCommentCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const comments_repository_1 = require("../../repositories/comments.repository");
class LikeDislikeCommentCommand {
    constructor(commmentId, likeStatus, userId, login) {
        this.commmentId = commmentId;
        this.likeStatus = likeStatus;
        this.userId = userId;
        this.login = login;
    }
}
exports.LikeDislikeCommentCommand = LikeDislikeCommentCommand;
let LikeDislikeCommentUseCase = class LikeDislikeCommentUseCase {
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    async execute(command) {
        return await this.commentsRepository.like_dislike(command.commmentId, command.likeStatus, command.userId, command.login);
    }
};
exports.LikeDislikeCommentUseCase = LikeDislikeCommentUseCase;
exports.LikeDislikeCommentUseCase = LikeDislikeCommentUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(LikeDislikeCommentCommand),
    __metadata("design:paramtypes", [comments_repository_1.CommentsRepository])
], LikeDislikeCommentUseCase);
//# sourceMappingURL=Like_dislike_for_comment.js.map