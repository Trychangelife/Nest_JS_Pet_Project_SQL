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
exports.TerminateSessionByIdUseCase = exports.TerminateSessionByIdCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const security_repository_1 = require("../../repostitories/security.repository");
class TerminateSessionByIdCommand {
    constructor(userId, deviceId) {
        this.userId = userId;
        this.deviceId = deviceId;
    }
}
exports.TerminateSessionByIdCommand = TerminateSessionByIdCommand;
let TerminateSessionByIdUseCase = class TerminateSessionByIdUseCase {
    constructor(securityDeviceRepository) {
        this.securityDeviceRepository = securityDeviceRepository;
    }
    async execute(command) {
        const terminateResult = await this.securityDeviceRepository.terminateTargetSessionById(command.userId, command.deviceId);
        return terminateResult;
    }
};
exports.TerminateSessionByIdUseCase = TerminateSessionByIdUseCase;
exports.TerminateSessionByIdUseCase = TerminateSessionByIdUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(TerminateSessionByIdCommand),
    __metadata("design:paramtypes", [security_repository_1.SecurityDeviceRepository])
], TerminateSessionByIdUseCase);
//# sourceMappingURL=Terminate_target_session_by_id.js.map