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
exports.CreateCommentForSpecificPostUseCase = exports.CreateCommentForSpecificPostCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const posts_repository_1 = require("../../repositories/posts.repository");
const types_1 = require("../../../utils/types");
const CommentsClass_1 = require("../../../comments/dto/CommentsClass");
const uuid_1 = require("uuid");
class CreateCommentForSpecificPostCommand {
    constructor(postId, content, userId, userLogin) {
        this.postId = postId;
        this.content = content;
        this.userId = userId;
        this.userLogin = userLogin;
    }
}
exports.CreateCommentForSpecificPostCommand = CreateCommentForSpecificPostCommand;
let CreateCommentForSpecificPostUseCase = class CreateCommentForSpecificPostUseCase {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async execute(command) {
        const foundPost = await this.postsRepository.targetPosts(command.postId);
        if (foundPost) {
            const createdComment = new CommentsClass_1.Comments((0, uuid_1.v4)(), command.content, { userId: command.userId, userLogin: command.userLogin }, (new Date()).toISOString(), command.postId, { likesCount: 0, dislikesCount: 0, myStatus: types_1.LIKES.NONE });
            return this.postsRepository.createCommentForSpecificPost(createdComment);
        }
        else {
            return false;
        }
    }
};
exports.CreateCommentForSpecificPostUseCase = CreateCommentForSpecificPostUseCase;
exports.CreateCommentForSpecificPostUseCase = CreateCommentForSpecificPostUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(CreateCommentForSpecificPostCommand),
    __metadata("design:paramtypes", [posts_repository_1.PostRepository])
], CreateCommentForSpecificPostUseCase);
//# sourceMappingURL=create_comment_for_specific_post.js.map