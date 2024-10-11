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
exports.CheckForbiddenUseCase = exports.CheckForbiddenCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const posts_repository_1 = require("../../repositories/posts.repository");
class CheckForbiddenCommand {
    constructor(postId, userId) {
        this.postId = postId;
        this.userId = userId;
    }
}
exports.CheckForbiddenCommand = CheckForbiddenCommand;
let CheckForbiddenUseCase = class CheckForbiddenUseCase {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async execute(command) {
        const foundPost = await this.postsRepository.targetPosts(command.postId, null, "full");
        if ((foundPost === null || foundPost === void 0 ? void 0 : foundPost.authorUserId) === command.userId) {
            return true;
        }
        else {
            return false;
        }
    }
};
exports.CheckForbiddenUseCase = CheckForbiddenUseCase;
exports.CheckForbiddenUseCase = CheckForbiddenUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(CheckForbiddenCommand),
    __metadata("design:paramtypes", [posts_repository_1.PostRepository])
], CheckForbiddenUseCase);
//# sourceMappingURL=check_forbidden.js.map