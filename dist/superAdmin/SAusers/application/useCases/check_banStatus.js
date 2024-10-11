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
exports.CheckBanStatusSuperAdminUseCase = exports.CheckBanStatusSuperAdminCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const SuperAdmin_user_repository_1 = require("../../repositories/SuperAdmin.user.repository");
class CheckBanStatusSuperAdminCommand {
    constructor(userId, blogId) {
        this.userId = userId;
        this.blogId = blogId;
    }
}
exports.CheckBanStatusSuperAdminCommand = CheckBanStatusSuperAdminCommand;
let CheckBanStatusSuperAdminUseCase = class CheckBanStatusSuperAdminUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(command) {
        if (command.userId) {
            const checkResult = await this.usersRepository.checkBanStatus(command.userId, null);
            return checkResult;
        }
        if (command.blogId) {
            const checkResult = await this.usersRepository.checkBanStatus(null, command.blogId);
            return checkResult;
        }
    }
};
exports.CheckBanStatusSuperAdminUseCase = CheckBanStatusSuperAdminUseCase;
exports.CheckBanStatusSuperAdminUseCase = CheckBanStatusSuperAdminUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(CheckBanStatusSuperAdminCommand),
    __metadata("design:paramtypes", [SuperAdmin_user_repository_1.SuperAdminUsersRepository])
], CheckBanStatusSuperAdminUseCase);
//# sourceMappingURL=check_banStatus.js.map