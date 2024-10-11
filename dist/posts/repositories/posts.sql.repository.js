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
exports.PostsRepositorySql = exports.commentsVievModel = exports.postViewModel = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
exports.postViewModel = {
    _id: 0,
    id: 1,
    title: 1,
    shortDescription: 1,
    content: 1,
    bloggerId: 1,
    bloggerName: 1,
    addedAt: 1,
    extendedLikesInfo: 1,
};
exports.commentsVievModel = {
    _id: 0,
    postId: 0,
    __v: 0,
    likeStorage: 0,
    dislikeStorage: 0
};
let PostsRepositorySql = class PostsRepositorySql {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async allPosts(skip, limit, page, userId) {
        const totalCount = await this.dataSource.query(`SELECT COUNT (*) FROM "Posts"`);
        const keys = Object.keys(totalCount);
        const pagesCount = Math.ceil(totalCount[keys[0]].count / limit);
        const getAllPosts = await this.dataSource.query(`SELECT * FROM "Posts" ORDER BY id LIMIT $1 OFFSET $2`, [limit, skip]);
        return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: parseInt(totalCount[keys[0]].count), items: getAllPosts };
    }
    async releasePost(newPosts, blogId, bloggerIdUrl) {
        const findBlogger = await this.dataSource.query(`SELECT id FROM "Bloggers" WHERE id = $1`, [blogId]);
        if (findBlogger.length < 1) {
            return "400";
        }
        const result = await this.dataSource.query(`
    INSERT INTO "Posts" (title, "shortDescription", content, "bloggerId", "bloggerName")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, [newPosts.title, newPosts.shortDescription, newPosts.content, blogId, newPosts.blogName]);
        if (result !== null) {
            return result;
        }
        else {
            return "400";
        }
    }
};
exports.PostsRepositorySql = PostsRepositorySql;
exports.PostsRepositorySql = PostsRepositorySql = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], PostsRepositorySql);
//# sourceMappingURL=posts.sql.repository.js.map