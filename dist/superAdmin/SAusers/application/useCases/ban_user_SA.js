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
exports.BanUserAsSuperAdminUseCase = exports.BanUserAsSuperAdminCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const SuperAdmin_user_repository_1 = require("../../repositories/SuperAdmin.user.repository");
class BanUserAsSuperAdminCommand {
    constructor(id, reason, isBanned) {
        this.id = id;
        this.reason = reason;
        this.isBanned = isBanned;
    }
}
exports.BanUserAsSuperAdminCommand = BanUserAsSuperAdminCommand;
let BanUserAsSuperAdminUseCase = class BanUserAsSuperAdminUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(command) {
        return await this.usersRepository.banUser(command.id, command.reason, command.isBanned);
    }
};
exports.BanUserAsSuperAdminUseCase = BanUserAsSuperAdminUseCase;
exports.BanUserAsSuperAdminUseCase = BanUserAsSuperAdminUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(BanUserAsSuperAdminCommand),
    __metadata("design:paramtypes", [SuperAdmin_user_repository_1.SuperAdminUsersRepository])
], BanUserAsSuperAdminUseCase);
//# sourceMappingURL=ban_user_SA.js.map