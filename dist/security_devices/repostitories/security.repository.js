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
exports.SecurityDeviceRepository = exports.deviceView = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
exports.deviceView = {
    _id: 0,
    ip: 1,
    title: 1,
    lastActiveDate: 1,
    deviceId: 1
};
let SecurityDeviceRepository = class SecurityDeviceRepository {
    constructor(refreshTokenModel) {
        this.refreshTokenModel = refreshTokenModel;
    }
    async returnAllDevices(userId) {
        const foundAllDevice = await this.refreshTokenModel.find({ userId: userId }, exports.deviceView).lean();
        return foundAllDevice;
    }
    async terminateAllSession(userId, deviceId) {
        const foundAllDevice = await this.refreshTokenModel.find({ userId: userId }).lean();
        for (const device of foundAllDevice) {
            if (device.deviceId !== deviceId) {
                await this.refreshTokenModel.deleteOne({ deviceId: device.deviceId });
            }
        }
        return true;
    }
    async terminateTargetSessionById(userId, deviceId) {
        await this.refreshTokenModel.deleteOne({ userId: userId, deviceId: deviceId });
        return true;
    }
    async foundUserIdByDeviceId(deviceId) {
        const foundUserByDeviceId = await this.refreshTokenModel.findOne({ deviceId: deviceId }).lean();
        if (foundUserByDeviceId) {
            return foundUserByDeviceId.userId;
        }
        return null;
    }
};
exports.SecurityDeviceRepository = SecurityDeviceRepository;
exports.SecurityDeviceRepository = SecurityDeviceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('RefreshToken')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SecurityDeviceRepository);
//# sourceMappingURL=security.repository.js.map