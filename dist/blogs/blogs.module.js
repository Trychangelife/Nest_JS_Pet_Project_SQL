"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const db_1 = require("../db");
const blogs_controller_1 = require("./blogs.controller");
const blogs_repository_1 = require("./repositories/blogs.repository");
const blogs_service_1 = require("./application/blogs.service");
const jwt_1 = require("@nestjs/jwt");
const jwt_service_1 = require("../guards/jwt.service");
const posts_repository_1 = require("../posts/repositories/posts.repository");
const posts_service_1 = require("../posts/application/posts.service");
let BlogsModule = class BlogsModule {
};
exports.BlogsModule = BlogsModule;
exports.BlogsModule = BlogsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'Blogs', schema: db_1.blogsSchema },
                { name: 'Posts', schema: db_1.postSchema }, { name: 'Comments', schema: db_1.commentsSchema }, { name: 'Users', schema: db_1.usersSchema }, { name: 'RefreshToken', schema: db_1.refreshTokenSchema }
            ])],
        controllers: [blogs_controller_1.BlogsController],
        providers: [blogs_repository_1.BlogsRepository, blogs_service_1.BlogsService, posts_service_1.PostsService, posts_repository_1.PostRepository, jwt_service_1.JwtServiceClass, jwt_1.JwtService]
    })
], BlogsModule);
//# sourceMappingURL=blogs.module.js.map