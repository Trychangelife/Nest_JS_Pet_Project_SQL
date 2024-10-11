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
exports.DeletePostUseCase = exports.DeletePostCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const posts_repository_1 = require("../../repositories/posts.repository");
class DeletePostCommand {
    constructor(deleteId) {
        this.deleteId = deleteId;
    }
}
exports.DeletePostCommand = DeletePostCommand;
let DeletePostUseCase = class DeletePostUseCase {
    constructor(postsRepository) {
        this.postsRepository = postsRepository;
    }
    async execute(command) {
        return await this.postsRepository.deletePost(command.deleteId);
    }
};
exports.DeletePostUseCase = DeletePostUseCase;
exports.DeletePostUseCase = DeletePostUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(DeletePostCommand),
    __metadata("design:paramtypes", [posts_repository_1.PostRepository])
], DeletePostUseCase);
//# sourceMappingURL=delete_post.js.map