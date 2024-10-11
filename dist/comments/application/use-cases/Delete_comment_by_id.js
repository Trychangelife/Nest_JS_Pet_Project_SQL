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
exports.DeleteCommentUseCase = exports.DeleteCommentCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const comments_repository_1 = require("../../repositories/comments.repository");
class DeleteCommentCommand {
    constructor(commentId, userId) {
        this.commentId = commentId;
        this.userId = userId;
    }
}
exports.DeleteCommentCommand = DeleteCommentCommand;
let DeleteCommentUseCase = class DeleteCommentUseCase {
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    async execute(command) {
        return await this.commentsRepository.deleteCommentByCommentId(command.commentId, command.userId);
    }
};
exports.DeleteCommentUseCase = DeleteCommentUseCase;
exports.DeleteCommentUseCase = DeleteCommentUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(DeleteCommentCommand),
    __metadata("design:paramtypes", [comments_repository_1.CommentsRepository])
], DeleteCommentUseCase);
//# sourceMappingURL=Delete_comment_by_id.js.map