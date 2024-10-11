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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/application/users.service");
const jwt_service_1 = require("./jwt.service");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtServiceClass, usersService) {
        this.jwtServiceClass = jwtServiceClass;
        this.usersService = usersService;
    }
    async canActivate(context) {
        try {
            const req = context.switchToHttp().getRequest();
            const bearer = req.headers.authorization.split(' ')[0];
            const token = req.headers.authorization.split(' ')[1];
            if (bearer !== "Bearer" || !token) {
                throw new common_1.UnauthorizedException(401);
            }
            const userId = await this.jwtServiceClass.getUserByAccessToken(token);
            if (userId) {
                const user = await this.usersService.findUserById(userId);
                req.user = user;
                return true;
            }
            else {
                throw new common_1.UnauthorizedException(401);
            }
        }
        catch (e) {
            throw new common_1.UnauthorizedException(401);
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtServiceClass,
        users_service_1.UsersService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map