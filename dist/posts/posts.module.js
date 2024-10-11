"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("../auth/auth.module");
const blogs_module_1 = require("../blogs/blogs.module");
const users_module_1 = require("../users/users.module");
const posts_controller_1 = require("./posts.controller");
const posts_repository_1 = require("./repositories/posts.repository");
const posts_service_1 = require("./application/posts.service");
const jwt_1 = require("@nestjs/jwt");
const jwt_service_1 = require("../guards/jwt.service");
const blogs_repository_1 = require("../blogs/repositories/blogs.repository");
const blogs_service_1 = require("../blogs/application/blogs.service");
const db_1 = require("../db");
let PostsModule = class PostsModule {
};
exports.PostsModule = PostsModule;
exports.PostsModule = PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, auth_module_1.AuthModule, blogs_module_1.BlogsModule, mongoose_1.MongooseModule.forFeature([
                { name: 'Posts', schema: db_1.postSchema },
                { name: 'Blogs', schema: db_1.blogsSchema },
                { name: 'Comments', schema: db_1.commentsSchema },
                { name: 'RefreshToken', schema: db_1.refreshTokenSchema },
                { name: 'Users', schema: db_1.usersSchema }
            ])],
        controllers: [posts_controller_1.PostController],
        providers: [posts_repository_1.PostRepository, posts_service_1.PostsService,
            blogs_repository_1.BlogsRepository, blogs_service_1.BlogsService, jwt_1.JwtService, jwt_service_1.JwtServiceClass
        ],
    })
], PostsModule);
//# sourceMappingURL=posts.module.js.map