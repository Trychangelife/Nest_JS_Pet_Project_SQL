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
exports.GetAllUsersAsSuperAdminUseCase = exports.GetAllUsersAsSuperAdminCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const SuperAdmin_user_repository_1 = require("../../repositories/SuperAdmin.user.repository");
class GetAllUsersAsSuperAdminCommand {
    constructor(pageSize, pageNumber, sortDirection, sortBy, searchEmailTerm, searchLoginTerm, banStatus) {
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
        this.sortDirection = sortDirection;
        this.sortBy = sortBy;
        this.searchEmailTerm = searchEmailTerm;
        this.searchLoginTerm = searchLoginTerm;
        this.banStatus = banStatus;
    }
}
exports.GetAllUsersAsSuperAdminCommand = GetAllUsersAsSuperAdminCommand;
let GetAllUsersAsSuperAdminUseCase = class GetAllUsersAsSuperAdminUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(command) {
        let skip = 0;
        if (command.pageNumber && command.pageSize) {
            skip = (command.pageNumber - 1) * command.pageSize;
        }
        return await this.usersRepository.allUsers(skip, command.pageSize, command.sortDirection, command.sortBy, command.pageNumber, command.searchEmailTerm, command.searchLoginTerm, command.banStatus);
    }
};
exports.GetAllUsersAsSuperAdminUseCase = GetAllUsersAsSuperAdminUseCase;
exports.GetAllUsersAsSuperAdminUseCase = GetAllUsersAsSuperAdminUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(GetAllUsersAsSuperAdminCommand),
    __metadata("design:paramtypes", [SuperAdmin_user_repository_1.SuperAdminUsersRepository])
], GetAllUsersAsSuperAdminUseCase);
//# sourceMappingURL=get_all_user_SA.js.map