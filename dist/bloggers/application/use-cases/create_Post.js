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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePostByBloggerUseCase = exports.CreatePostByBloggerCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const mongoose_1 = require("@nestjs/mongoose");
const typeorm_1 = require("@nestjs/typeorm");
const mongoose_2 = require("mongoose");
const PostClass_1 = require("../../../posts/dto/PostClass");
const posts_repository_1 = require("../../../posts/repositories/posts.repository");
const types_1 = require("../../../utils/types");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
class CreatePostByBloggerCommand {
    constructor(title, content, shortDescription, blogId) {
        this.title = title;
        this.content = content;
        this.shortDescription = shortDescription;
        this.blogId = blogId;
    }
}
exports.CreatePostByBloggerCommand = CreatePostByBloggerCommand;
let CreatePostByBloggerUseCase = class CreatePostByBloggerUseCase {
    constructor(postsRepository, bloggerModel, dataSource) {
        this.postsRepository = postsRepository;
        this.bloggerModel = bloggerModel;
        this.dataSource = dataSource;
    }
    async execute(command) {
        if (process.env.USE_DATABASE === "SQL") {
            const foundBlogger = await this.dataSource.query(`SELECT * FROM "Bloggers" WHERE id = $1`, [command.blogId]);
            if (foundBlogger.length >= 1 && command.blogId) {
                const newPost = new PostClass_1.PostClass((0, uuid_1.v4)(), command.title, command.content, command.shortDescription, command.blogId, foundBlogger[0].name, (new Date()).toISOString(), foundBlogger.blogOwnerInfo.userId, { likesCount: 0, dislikesCount: 0, myStatus: types_1.LIKES.NONE });
                return await this.postsRepository.releasePost(newPost, command.blogId);
            }
            else {
                return null;
            }
        }
        else {
            const foundBlogger = await this.bloggerModel.findOne({ id: command.blogId }).lean();
            if (foundBlogger !== null && command.blogId) {
                const newPost = new PostClass_1.PostClass((0, uuid_1.v4)(), command.title, command.content, command.shortDescription, command.blogId, foundBlogger.name, (new Date()).toISOString(), foundBlogger.blogOwnerInfo.userId, { likesCount: 0, dislikesCount: 0, myStatus: types_1.LIKES.NONE });
                return await this.postsRepository.releasePost(newPost, command.blogId);
            }
            else {
                return null;
            }
        }
    }
};
exports.CreatePostByBloggerUseCase = CreatePostByBloggerUseCase;
exports.CreatePostByBloggerUseCase = CreatePostByBloggerUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(CreatePostByBloggerCommand),
    __param(1, (0, mongoose_1.InjectModel)('Blogs')),
    __param(2, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [posts_repository_1.PostRepository,
        mongoose_2.Model,
        typeorm_2.DataSource])
], CreatePostByBloggerUseCase);
//# sourceMappingURL=create_Post.js.map