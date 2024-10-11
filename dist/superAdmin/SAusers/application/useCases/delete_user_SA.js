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
exports.DeleteUserAsSuperAdminUseCase = exports.DeleteUserAsSuperAdminCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const SuperAdmin_user_repository_1 = require("../../repositories/SuperAdmin.user.repository");
class DeleteUserAsSuperAdminCommand {
    constructor(id) {
        this.id = id;
    }
}
exports.DeleteUserAsSuperAdminCommand = DeleteUserAsSuperAdminCommand;
let DeleteUserAsSuperAdminUseCase = class DeleteUserAsSuperAdminUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(command) {
        return await this.usersRepository.deleteUser(command.id);
    }
};
exports.DeleteUserAsSuperAdminUseCase = DeleteUserAsSuperAdminUseCase;
exports.DeleteUserAsSuperAdminUseCase = DeleteUserAsSuperAdminUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(DeleteUserAsSuperAdminCommand),
    __metadata("design:paramtypes", [SuperAdmin_user_repository_1.SuperAdminUsersRepository])
], DeleteUserAsSuperAdminUseCase);
//# sourceMappingURL=delete_user_SA.js.map