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
exports.GetUserByUserIdUseCase = exports.GetUserByUserIdCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const users_repository_1 = require("../../repositories/users.repository");
class GetUserByUserIdCommand {
    constructor(userId) {
        this.userId = userId;
    }
}
exports.GetUserByUserIdCommand = GetUserByUserIdCommand;
let GetUserByUserIdUseCase = class GetUserByUserIdUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(command) {
        return await this.usersRepository.findUserById(command.userId);
    }
};
exports.GetUserByUserIdUseCase = GetUserByUserIdUseCase;
exports.GetUserByUserIdUseCase = GetUserByUserIdUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(GetUserByUserIdCommand),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], GetUserByUserIdUseCase);
//# sourceMappingURL=Get_user_by_id.js.map