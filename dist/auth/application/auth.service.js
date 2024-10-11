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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("../../users/repositories/users.repository");
const uuidv4_1 = require("uuidv4");
let AuthService = class AuthService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async ipAddressIsScam(ip, login) {
        return await this.usersRepository.ipAddressIsScam(ip, login);
    }
    async refreshActivationCode(email) {
        const refreshCode = (0, uuidv4_1.uuid)();
        return await this.usersRepository.refreshActivationCode(email, refreshCode);
    }
    async counterAttemptAuth(ip, login) {
        return await this.usersRepository.counterAttemptAuth(ip, login);
    }
    async counterAttemptConfirm(ip, code) {
        return await this.usersRepository.counterAttemptConfirm(ip, code);
    }
    async counterAttemptEmail(ip, email) {
        return await this.usersRepository.counterAttemptEmail(ip, email);
    }
    async counterAttemptRecoveryPassword(ip, email) {
        return await this.usersRepository.counterAttemptRecoveryPassword(ip, email);
    }
    async counterAttemptNewPassword(ip, code) {
        return await this.usersRepository.counterAttemptNewPassword(ip, code);
    }
    async informationAboutAuth(ip, login) {
        const authData = {
            ip,
            tryAuthDate: new Date(),
            login
        };
        return await this.usersRepository.informationAboutAuth(authData);
    }
    async informationAboutConfirmed(ip, code) {
        const confirmationData = {
            ip,
            tryConfirmDate: new Date(),
            code
        };
        return await this.usersRepository.informationAboutConfirmed(confirmationData);
    }
    async informationAboutEmailSend(ip, email) {
        const emailSendData = {
            ip,
            emailSendDate: new Date(),
            email
        };
        return await this.usersRepository.informationAboutEmailSend(emailSendData);
    }
    async informationAboutRecoveryPassword(ip, email) {
        const recoveryPasswordData = {
            ip,
            emailSendDate: new Date(),
            email
        };
        return await this.usersRepository.informationAboutPasswordRecovery(recoveryPasswordData);
    }
    async informationAboutNewPassword(ip, code) {
        const recoveryNewPasswordData = {
            ip,
            timestampNewPassword: new Date(),
            recoveryCode: code
        };
        return await this.usersRepository.informationAboutNewPassword(recoveryNewPasswordData);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], AuthService);
//# sourceMappingURL=auth.service.js.map