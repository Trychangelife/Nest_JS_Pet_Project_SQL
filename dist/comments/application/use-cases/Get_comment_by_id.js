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
exports.GetCommentUseCase = exports.GetCommentCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const comments_repository_1 = require("../../repositories/comments.repository");
class GetCommentCommand {
    constructor(id, userId) {
        this.id = id;
        this.userId = userId;
    }
}
exports.GetCommentCommand = GetCommentCommand;
let GetCommentUseCase = class GetCommentUseCase {
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    async execute(command) {
        return await this.commentsRepository.commentsByUserId(command.id, command.userId);
    }
};
exports.GetCommentUseCase = GetCommentUseCase;
exports.GetCommentUseCase = GetCommentUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(GetCommentCommand),
    __metadata("design:paramtypes", [comments_repository_1.CommentsRepository])
], GetCommentUseCase);
//# sourceMappingURL=Get_comment_by_id.js.map