"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const db_1 = require("../db");
const users_module_1 = require("../users/users.module");
const comments_controller_1 = require("./comments.controller");
const comments_repository_1 = require("./repositories/comments.repository");
const comments_service_1 = require("./application/comments.service");
const jwt_1 = require("@nestjs/jwt");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const jwt_service_1 = require("../guards/jwt.service");
let CommentsModule = class CommentsModule {
};
exports.CommentsModule = CommentsModule;
exports.CommentsModule = CommentsModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, mongoose_1.MongooseModule.forFeature([{ name: 'Comments', schema: db_1.commentsSchema },
                { name: 'RefreshToken', schema: db_1.refreshTokenSchema }, { name: 'Users', schema: db_1.usersSchema }
            ])],
        controllers: [comments_controller_1.CommentsController],
        providers: [comments_repository_1.CommentsRepository, comments_service_1.CommentsService,
            jwt_service_1.JwtServiceClass, jwt_auth_guard_1.JwtAuthGuard, jwt_1.JwtService, users_module_1.UsersModule
        ],
    })
], CommentsModule);
//# sourceMappingURL=comments.module.js.map