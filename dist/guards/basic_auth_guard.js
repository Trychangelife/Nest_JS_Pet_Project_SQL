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
exports.BasicAuthGuard = void 0;
const common_1 = require("@nestjs/common");
var base64 = require('base-64');
var utf8 = require('utf8');
let BasicAuthGuard = class BasicAuthGuard {
    constructor() { }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const headerAuth = req.headers.authorization;
        var userNamePassword = 'admin:qwerty';
        var bytes = utf8.encode(userNamePassword);
        var encoded = 'Basic ' + base64.encode(bytes);
        if (!headerAuth || headerAuth.indexOf('Basic ') === -1) {
            throw new common_1.HttpException('Missing Authorization Header', common_1.HttpStatus.UNAUTHORIZED);
        }
        else if (encoded !== headerAuth) {
            throw new common_1.HttpException('Incorrect password/login', common_1.HttpStatus.UNAUTHORIZED);
        }
        else {
            return true;
        }
    }
};
exports.BasicAuthGuard = BasicAuthGuard;
exports.BasicAuthGuard = BasicAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], BasicAuthGuard);
//# sourceMappingURL=basic_auth_guard.js.map