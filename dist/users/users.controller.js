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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const pagination_constructor_1 = require("../utils/pagination.constructor");
const users_service_1 = require("./application/users.service");
const exception_filter_1 = require("../exception_filters/exception_filter");
const users_registration_guard_1 = require("../guards/users.registration.guard");
const AuthForm_validator_1 = require("../auth/dto/AuthForm_validator");
const basic_auth_guard_1 = require("../guards/basic_auth_guard");
class CreateUser {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUser.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(10),
    __metadata("design:type", String)
], CreateUser.prototype, "login", void 0);
__decorate([
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateUser.prototype, "password", void 0);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getAllUsers(query) {
        const paginationData = (0, pagination_constructor_1.constructorPagination)(query.pageSize, query.pageNumber, query.sortBy, query.sortDirection, query.searchEmailTerm, query.searchLoginTerm);
        const resultUsers = await this.usersService.allUsers(paginationData.pageSize, paginationData.pageNumber, paginationData.sortDirection, paginationData.sortBy, paginationData.searchEmailTerm, paginationData.searchLoginTerm);
        return resultUsers;
    }
    async createUser(user, req) {
        const result = await this.usersService.createUser(user.password, user.login, user.email, req.ip);
        if (result == false) {
            throw new common_1.BadRequestException([{ message: 'Bad email', field: 'Email' }]);
        }
        else {
            return result;
        }
    }
    async deleteUserById(id) {
        const afterDelete = await this.usersService.deleteUser(id);
        if (afterDelete == true) {
            throw new common_2.HttpException('User was deleted', common_2.HttpStatus.NO_CONTENT);
        }
        else {
            throw new common_2.HttpException('User NOT FOUND', common_2.HttpStatus.NOT_FOUND);
        }
    }
    async getUserById(id) {
        const resultSearch = await this.usersService.findUserById(id);
        if (resultSearch !== null) {
            return resultSearch;
        }
        else {
            throw new common_2.HttpException('User NOT FOUND', common_2.HttpStatus.NOT_FOUND);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_2.Get)(),
    __param(0, (0, common_2.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_2.Post)(),
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_1.UseGuards)(users_registration_guard_1.UserRegistrationFlow),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthForm_validator_1.AuthForm, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)(basic_auth_guard_1.BasicAuthGuard),
    (0, common_2.Delete)(':id'),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUserById", null);
__decorate([
    (0, common_2.Get)(':id'),
    __param(0, (0, common_2.Param)(':id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
exports.UsersController = UsersController = __decorate([
    (0, common_2.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map