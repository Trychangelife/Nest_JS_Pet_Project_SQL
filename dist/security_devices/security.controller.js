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
exports.SecurityDeviceController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_service_1 = require("../guards/jwt.service");
const users_repository_1 = require("../users/repositories/users.repository");
const security_service_1 = require("./application/security.service");
const cqrs_1 = require("@nestjs/cqrs");
const Get_all_devices_1 = require("./application/use-cases/Get_all_devices");
const Terminate_all_session_1 = require("./application/use-cases/Terminate_all_session");
const Terminate_target_session_by_id_1 = require("./application/use-cases/Terminate_target_session_by_id");
const Found_user_by_device_id_1 = require("./application/use-cases/Found_user_by_device_id");
let SecurityDeviceController = class SecurityDeviceController {
    constructor(jwtServiceClass, usersRepository, securityService, commandBus, refreshTokenModel) {
        this.jwtServiceClass = jwtServiceClass;
        this.usersRepository = usersRepository;
        this.securityService = securityService;
        this.commandBus = commandBus;
        this.refreshTokenModel = refreshTokenModel;
    }
    async returnAllDevices(req) {
        const refreshToken = req.cookies["refreshToken"];
        const userId = await this.jwtServiceClass.getUserByRefreshToken(refreshToken);
        if (!refreshToken) {
            throw new common_1.HttpException('Refresh token not found, where you cookie?', common_1.HttpStatus.UNAUTHORIZED);
        }
        const resultAllDevice = await this.commandBus.execute(new Get_all_devices_1.GetAllDevicesCommand(userId));
        return resultAllDevice;
    }
    async terminateAllSession(req) {
        const refreshToken = req.cookies["refreshToken"];
        const userAgent = req.headers['user-agent'];
        if (!refreshToken) {
            throw new common_1.HttpException('Refresh token not found, where you cookie?', common_1.HttpStatus.UNAUTHORIZED);
        }
        const userId = await this.jwtServiceClass.getUserByRefreshToken(refreshToken);
        const checkRefreshToken = await this.jwtServiceClass.checkRefreshToken(refreshToken);
        if (!checkRefreshToken) {
            throw new common_1.HttpException('Refresh token expired or incorect', common_1.HttpStatus.UNAUTHORIZED);
        }
        const payload = await this.jwtServiceClass.getJwtPayload(refreshToken);
        await this.commandBus.execute(new Terminate_all_session_1.TerminateAllSessionCommand(userId, payload.deviceId));
        throw new common_1.HttpException("All session terminate", common_1.HttpStatus.NO_CONTENT);
    }
    async terminateTargetSessionById(req, deviceId) {
        const refreshToken = req.cookies["refreshToken"];
        if (!refreshToken) {
            throw new common_1.HttpException('Refresh token not found, where you cookie?', common_1.HttpStatus.UNAUTHORIZED);
        }
        const userId = await this.jwtServiceClass.getUserByRefreshToken(refreshToken);
        const foundUserIdByDeviceId = await this.commandBus.execute(new Found_user_by_device_id_1.FoundUserByDeviceIdCommand(deviceId));
        if (foundUserIdByDeviceId == null) {
            throw new common_1.HttpException('Not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (!userId) {
            throw new common_1.HttpException('Refresh token expired or incorrect', common_1.HttpStatus.UNAUTHORIZED);
        }
        const payload = await this.jwtServiceClass.getJwtPayload(refreshToken);
        if (payload.id !== foundUserIdByDeviceId) {
            throw new common_1.HttpException('Forbidden, this user does not have authorization to delete this device ID', common_1.HttpStatus.FORBIDDEN);
        }
        await this.commandBus.execute(new Terminate_target_session_by_id_1.TerminateSessionByIdCommand(userId, deviceId));
        throw new common_1.HttpException("All sessions terminated", common_1.HttpStatus.NO_CONTENT);
    }
};
exports.SecurityDeviceController = SecurityDeviceController;
__decorate([
    (0, common_1.Get)('devices'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityDeviceController.prototype, "returnAllDevices", null);
__decorate([
    (0, common_1.Delete)('devices'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SecurityDeviceController.prototype, "terminateAllSession", null);
__decorate([
    (0, common_1.Delete)('devices/:deviceId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SecurityDeviceController.prototype, "terminateTargetSessionById", null);
exports.SecurityDeviceController = SecurityDeviceController = __decorate([
    (0, common_1.Controller)('security'),
    __param(4, (0, mongoose_1.InjectModel)('RefreshToken')),
    __metadata("design:paramtypes", [jwt_service_1.JwtServiceClass,
        users_repository_1.UsersRepository,
        security_service_1.SecurityDeviceService,
        cqrs_1.CommandBus,
        mongoose_2.Model])
], SecurityDeviceController);
//# sourceMappingURL=security.controller.js.map