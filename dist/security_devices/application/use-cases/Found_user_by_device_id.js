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
exports.FoundUserByDeviceIdUseCase = exports.FoundUserByDeviceIdCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const security_repository_1 = require("../../repostitories/security.repository");
class FoundUserByDeviceIdCommand {
    constructor(deviceId) {
        this.deviceId = deviceId;
    }
}
exports.FoundUserByDeviceIdCommand = FoundUserByDeviceIdCommand;
let FoundUserByDeviceIdUseCase = class FoundUserByDeviceIdUseCase {
    constructor(securityDeviceRepository) {
        this.securityDeviceRepository = securityDeviceRepository;
    }
    async execute(command) {
        const foundUserByDeviceId = await this.securityDeviceRepository.foundUserIdByDeviceId(command.deviceId);
        return foundUserByDeviceId;
    }
};
exports.FoundUserByDeviceIdUseCase = FoundUserByDeviceIdUseCase;
exports.FoundUserByDeviceIdUseCase = FoundUserByDeviceIdUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(FoundUserByDeviceIdCommand),
    __metadata("design:paramtypes", [security_repository_1.SecurityDeviceRepository])
], FoundUserByDeviceIdUseCase);
//# sourceMappingURL=Found_user_by_device_id.js.map