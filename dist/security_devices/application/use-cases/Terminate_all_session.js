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
exports.TerminateAllSessionUseCase = exports.TerminateAllSessionCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const security_repository_1 = require("../../repostitories/security.repository");
class TerminateAllSessionCommand {
    constructor(userId, deviceId) {
        this.userId = userId;
        this.deviceId = deviceId;
    }
}
exports.TerminateAllSessionCommand = TerminateAllSessionCommand;
let TerminateAllSessionUseCase = class TerminateAllSessionUseCase {
    constructor(securityDeviceRepository) {
        this.securityDeviceRepository = securityDeviceRepository;
    }
    async execute(command) {
        const terminateResult = await this.securityDeviceRepository.terminateAllSession(command.userId, command.deviceId);
        return terminateResult;
    }
};
exports.TerminateAllSessionUseCase = TerminateAllSessionUseCase;
exports.TerminateAllSessionUseCase = TerminateAllSessionUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(TerminateAllSessionCommand),
    __metadata("design:paramtypes", [security_repository_1.SecurityDeviceRepository])
], TerminateAllSessionUseCase);
//# sourceMappingURL=Terminate_all_session.js.map