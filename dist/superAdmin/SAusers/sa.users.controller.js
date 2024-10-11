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
exports.SuperAdminUsersController = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const AuthForm_validator_1 = require("../../auth/dto/AuthForm_validator");
const exception_filter_1 = require("../../exception_filters/exception_filter");
const basic_auth_guard_1 = require("../../guards/basic_auth_guard");
const users_registration_guard_1 = require("../../guards/users.registration.guard");
const create_user_SA_1 = require("./application/useCases/create_user_SA");
const pagination_constructor_1 = require("../../utils/pagination.constructor");
const get_all_user_SA_1 = require("./application/useCases/get_all_user_SA");
const delete_user_SA_1 = require("./application/useCases/delete_user_SA");
const ban_user_SA_1 = require("./application/useCases/ban_user_SA");
const banUserInputModel_1 = require("./dto/banUserInputModel");
let SuperAdminUsersController = class SuperAdminUsersController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    async createUser(user, req, res) {
        const result = await this.commandBus.execute(new create_user_SA_1.CreateUserSACommand(user.password, user.login, user.email, req.ip));
        if (result == false) {
            throw new common_1.HttpException("", common_1.HttpStatus.BAD_REQUEST);
        }
        else if (result == null) {
            throw new common_1.HttpException("To many requests", common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        else {
            res
                .status(201)
                .send(result);
        }
    }
    async getAllUsers(query) {
        const paginationData = (0, pagination_constructor_1.constructorPagination)(query.pageSize, query.pageNumber, query.sortBy, query.sortDirection, query.searchEmailTerm, query.searchLoginTerm);
        const resultUsers = await this.commandBus.execute(new get_all_user_SA_1.GetAllUsersAsSuperAdminCommand(paginationData.pageSize, paginationData.pageNumber, paginationData.sortDirection, paginationData.sortBy, paginationData.searchEmailTerm, paginationData.searchLoginTerm, query.banStatus));
        return resultUsers;
    }
    async deleteUserById(id) {
        const afterDelete = await this.commandBus.execute(new delete_user_SA_1.DeleteUserAsSuperAdminCommand(id));
        if (afterDelete == true) {
            throw new common_1.HttpException('User was deleted', common_1.HttpStatus.NO_CONTENT);
        }
        else {
            throw new common_1.HttpException('User NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async banUser(id, banInputModel) {
        const afterBan = await this.commandBus.execute(new ban_user_SA_1.BanUserAsSuperAdminCommand(id, banInputModel.banReason, banInputModel.isBanned));
        if (afterBan == true) {
            throw new common_1.HttpException('User was banned', common_1.HttpStatus.NO_CONTENT);
        }
        else {
            throw new common_1.HttpException('User NOT FOUND', common_1.HttpStatus.NOT_FOUND);
        }
    }
};
exports.SuperAdminUsersController = SuperAdminUsersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.UseGuards)(users_registration_guard_1.UserRegistrationFlow),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthForm_validator_1.AuthForm, Object, Object]),
    __metadata("design:returntype", Promise)
], SuperAdminUsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminUsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminUsersController.prototype, "deleteUserById", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Put)(':id/ban'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, banUserInputModel_1.BanUserInputModel]),
    __metadata("design:returntype", Promise)
], SuperAdminUsersController.prototype, "banUser", null);
exports.SuperAdminUsersController = SuperAdminUsersController = __decorate([
    (0, common_1.Controller)('sa/users'),
    __metadata("design:paramtypes", [cqrs_1.CommandBus])
], SuperAdminUsersController);
//# sourceMappingURL=sa.users.controller.js.map