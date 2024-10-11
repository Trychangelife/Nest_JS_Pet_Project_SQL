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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const jwt_service_1 = require("../guards/jwt.service");
const comments_service_1 = require("./application/comments.service");
const exception_filter_1 = require("../exception_filters/exception_filter");
const class_validator_form_1 = require("../utils/class-validator.form");
const Comment_validator_type_1 = require("./dto/Comment_validator_type");
const exception_likes_1 = require("../exception_filters/exception_likes");
const cqrs_1 = require("@nestjs/cqrs");
const Get_comment_by_id_1 = require("./application/use-cases/Get_comment_by_id");
const Delete_comment_by_id_1 = require("./application/use-cases/Delete_comment_by_id");
const Update_Comment_By_Comment_Id_1 = require("./application/use-cases/Update_Comment_By_Comment_Id");
const Like_dislike_for_comment_1 = require("./application/use-cases/Like_dislike_for_comment");
const check_banStatus_1 = require("../superAdmin/SAusers/application/useCases/check_banStatus");
let CommentsController = class CommentsController {
    constructor(commentsService, jwtServiceClass, commandBus) {
        this.commentsService = commentsService;
        this.jwtServiceClass = jwtServiceClass;
        this.commandBus = commandBus;
    }
    async getCommentById(params, req) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const userId = await this.jwtServiceClass.getUserByAccessToken(token);
            const result = await this.commandBus.execute(new Get_comment_by_id_1.GetCommentCommand(params.id, userId));
            const checkBan = await this.commandBus.execute(new check_banStatus_1.CheckBanStatusSuperAdminCommand(result === null || result === void 0 ? void 0 : result.commentatorInfo.userId, null));
            if (result !== null) {
                return result;
            }
            else {
                throw new common_1.HttpException('Comments NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            }
        }
        catch (error) {
            const result = await this.commandBus.execute(new Get_comment_by_id_1.GetCommentCommand(params.id));
            if (result !== null && result !== undefined) {
                return result;
            }
            else {
                throw new common_1.HttpException('Comments NOT FOUND', common_1.HttpStatus.NOT_FOUND);
            }
        }
    }
    async updateCommentByCommentId(params, content, req, res) {
        const result = await this.commandBus.execute(new Update_Comment_By_Comment_Id_1.UpdateCommentCommand(params.commentId, content.content, req.user.id));
        if (result) {
            res.send('update done');
        }
        else if (result == null) {
            throw new common_1.HttpException('Comments NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            throw new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
        }
    }
    async deleteCommentById(params, req, res) {
        const resultDelete = await this.commandBus.execute(new Delete_comment_by_id_1.DeleteCommentCommand(params.Id, req.user.id));
        if (resultDelete) {
            res.send('delete done');
        }
        else if (resultDelete == null) {
            throw new common_1.HttpException('Comments NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
        else {
            throw new common_1.HttpException('FORBIDDEN', common_1.HttpStatus.FORBIDDEN);
        }
    }
    async like_dislike(params, likeStatus, req, res) {
        const like_dislike = await this.commandBus.execute(new Like_dislike_for_comment_1.LikeDislikeCommentCommand(params.commentId, likeStatus, req.user.id, req.user.login));
        if (like_dislike !== "404" && like_dislike !== '400') {
            throw new common_1.HttpException(like_dislike, common_1.HttpStatus.NO_CONTENT);
        }
        else if (like_dislike === "400") {
            throw new common_1.HttpException({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 }, common_1.HttpStatus.BAD_REQUEST);
        }
        else {
            throw new common_1.HttpException('Comment NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "getCommentById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Put)(':commentId'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Comment_validator_type_1.Comment, Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "updateCommentByCommentId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':Id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "deleteCommentById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseFilters)(new exception_likes_1.HttpExceptionFilterForLikes()),
    (0, common_1.Put)(':commentId/like-status'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, class_validator_form_1.LikesDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], CommentsController.prototype, "like_dislike", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService,
        jwt_service_1.JwtServiceClass,
        cqrs_1.CommandBus])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map