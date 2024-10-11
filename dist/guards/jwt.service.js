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
exports.JwtServiceClass = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const uuidv4_1 = require("uuidv4");
let JwtServiceClass = class JwtServiceClass {
    constructor(refreshTokenModel, jwtService) {
        this.refreshTokenModel = refreshTokenModel;
        this.jwtService = jwtService;
    }
    async accessToken(user) {
        const accessToken = this.jwtService.sign({ id: user.id }, { secret: process.env.JWT_SECRET, expiresIn: '10s' });
        return accessToken;
    }
    async refreshToken(user, ip, titleDevice, rToken) {
        const checkUserAgent = await this.refreshTokenModel.findOne({ userId: user.id, title: titleDevice }).lean();
        const checkToken = await this.refreshTokenModel.findOne({ refreshToken: rToken }).lean();
        if (checkUserAgent !== null) {
            const deviceId = checkUserAgent.deviceId;
            const refreshToken = this.jwtService.sign({ id: user.id, deviceId: deviceId }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20s' });
            await this.refreshTokenModel.updateOne({ userId: user.id, deviceId: deviceId }, { $set: { lastActiveDate: new Date(), refreshToken: refreshToken } });
            return refreshToken;
        }
        else if (checkToken !== null) {
            const deviceId = checkToken.deviceId;
            const refreshToken = this.jwtService.sign({ id: user.id, deviceId: deviceId }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20s' });
            await this.refreshTokenModel.updateOne({ userId: user.id, deviceId: deviceId }, { $set: { lastActiveDate: new Date(), refreshToken: refreshToken } });
            return refreshToken;
        }
        else {
            const deviceId = (0, uuidv4_1.uuid)();
            const refreshToken = this.jwtService.sign({ id: user.id, deviceId: deviceId }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '20s' });
            const newRefreshTokenForStorage = {
                userId: user.id,
                refreshToken: refreshToken,
                ip: ip,
                title: titleDevice,
                lastActiveDate: new Date(),
                deviceId: deviceId
            };
            await this.refreshTokenModel.create(newRefreshTokenForStorage);
            return refreshToken;
        }
    }
    async getUserByAccessToken(token) {
        try {
            const result = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            return result.id;
        }
        catch (error) {
            return null;
        }
    }
    async getUserByRefreshToken(token) {
        try {
            const result = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
            return result.id;
        }
        catch (error) {
            return null;
        }
    }
    async getNewAccessToken(rToken, ip, titleDevice) {
        const checkToken = await this.refreshTokenModel.findOne({ refreshToken: rToken }).lean();
        if (checkToken !== null) {
            try {
                const result = this.jwtService.verify(checkToken.refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
                const newAccessToken = await this.accessToken(result);
                const newRefreshToken = await this.refreshToken(result, ip, titleDevice, rToken);
                return { newAccessToken, newRefreshToken };
            }
            catch (error) {
                return null;
            }
        }
        else {
            return null;
        }
    }
    async checkRefreshToken(refreshToken) {
        try {
            const result = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
            return { token: result };
        }
        catch (error) {
            return false;
        }
    }
    async getJwtPayload(refreshToken) {
        const tokenParts = refreshToken.split('.');
        const payloadString = Buffer.from(tokenParts[1], 'base64').toString('utf-8');
        const payload = JSON.parse(payloadString);
        return payload;
    }
};
exports.JwtServiceClass = JwtServiceClass;
exports.JwtServiceClass = JwtServiceClass = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('RefreshToken')),
    __metadata("design:paramtypes", [mongoose_2.Model, jwt_1.JwtService])
], JwtServiceClass);
//# sourceMappingURL=jwt.service.js.map