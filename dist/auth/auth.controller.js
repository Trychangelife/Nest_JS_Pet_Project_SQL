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
exports.AuthController = void 0;
const email_service_1 = require("../email/email.service");
const users_repository_1 = require("../users/repositories/users.repository");
const users_service_1 = require("../users/application/users.service");
const auth_service_1 = require("./application/auth.service");
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../guards/jwt.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const exception_filter_1 = require("../exception_filters/exception_filter");
const users_registration_guard_1 = require("../guards/users.registration.guard");
const AuthForm_validator_1 = require("./dto/AuthForm_validator");
const EmailForRecoveryPassword_Validator_1 = require("./dto/EmailForRecoveryPassword_Validator");
const NewPassword_Validator_1 = require("./dto/NewPassword_Validator");
let AuthController = class AuthController {
    constructor(usersRepository, usersService, authService, emailService, jwtService, refreshTokenModel) {
        this.usersRepository = usersRepository;
        this.usersService = usersService;
        this.authService = authService;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.refreshTokenModel = refreshTokenModel;
    }
    async authorization(req, DataUser, res) {
        await this.authService.informationAboutAuth(req.ip, DataUser.loginOrEmail);
        const ip = req.ip;
        const aboutDevice = req.headers['user-agent'];
        const checkIP = await this.authService.counterAttemptAuth(req.ip, DataUser.loginOrEmail);
        if (checkIP) {
            const user = await this.usersService.checkCredentials(DataUser.loginOrEmail, DataUser.password);
            const foundUser = await this.usersRepository.findUserByLogin(DataUser.loginOrEmail, "full");
            if (!user || (foundUser === null || foundUser === void 0 ? void 0 : foundUser.banInfo.isBanned) == true) {
                throw new common_1.HttpException("UNAUTHORIZED", common_1.HttpStatus.UNAUTHORIZED);
            }
            else if (foundUser && user) {
                const accessToken = await this.jwtService.accessToken(foundUser);
                const refreshToken = await this.jwtService.refreshToken(foundUser, ip, aboutDevice);
                res
                    .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true
                })
                    .status(200)
                    .send({ accessToken });
            }
            else {
                throw new common_1.HttpException("Something wrong", common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else {
            throw new common_1.HttpException("To many requests", common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    async updateAccessToken(req, res) {
        const refreshToken = req.cookies["refreshToken"];
        const ip = req.ip;
        const aboutDevice = req.headers['user-agent'];
        if (!refreshToken) {
            throw new common_1.HttpException('Refresh token not found, where you cookie?', common_1.HttpStatus.UNAUTHORIZED);
        }
        else if (refreshToken) {
            const newAccessToken = await this.jwtService.getNewAccessToken(refreshToken, ip, aboutDevice);
            if (newAccessToken !== null) {
                res
                    .cookie("refreshToken", newAccessToken.newRefreshToken, {
                    httpOnly: true,
                    secure: true
                })
                    .status(200)
                    .send({ accessToken: newAccessToken.newAccessToken });
            }
            else {
                throw new common_1.HttpException('Refresh Token already not valid, repeat authorization', common_1.HttpStatus.UNAUTHORIZED);
            }
        }
        else {
            throw new common_1.HttpException("Something wrong", common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async registration(user, req, res) {
        const result = await this.usersService.createUser(user.password, user.login, user.email, req.ip);
        if (result == false) {
            throw new common_1.HttpException("", common_1.HttpStatus.BAD_REQUEST);
        }
        else if (result == null) {
            throw new common_1.HttpException("To many requests", common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        else {
            res
                .status(204)
                .send(result);
        }
    }
    async registrationConfirmation(body, req, res) {
        await this.authService.informationAboutConfirmed(req.ip, body.code);
        const checkInputCode = await this.authService.counterAttemptConfirm(req.ip, body.code);
        if (checkInputCode) {
            const activationResult = await this.usersService.confirmationEmail(body.code);
            if (activationResult) {
                res.status(204).send(checkInputCode);
            }
            else {
                const errorResponseForConfirmAccount = { errorsMessages: [{ message: 'account already confirmed', field: "code", }] };
                throw new common_1.HttpException(errorResponseForConfirmAccount, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else {
            throw new common_1.HttpException("To many requests", common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    async registrationEmailResending(user, req) {
        await this.authService.informationAboutEmailSend(req.ip, user.email);
        const checkAttemptEmail = await this.authService.counterAttemptEmail(req.ip, user.email);
        if (checkAttemptEmail) {
            await this.authService.refreshActivationCode(user.email);
            const emailResending = await this.emailService.emailConfirmation(user.email);
            if (emailResending) {
                throw new common_1.HttpException("Email send succefully", common_1.HttpStatus.NO_CONTENT);
            }
            else {
                const errorResponseForConfirmAccount = { errorsMessages: [{ message: 'account already confirmed', field: "email", }] };
                throw new common_1.HttpException(errorResponseForConfirmAccount, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else {
            throw new common_1.HttpException("To many requests", common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    async logout(req) {
        const refreshTokenInCookie = req.cookies.refreshToken;
        const checkRefreshToken = await this.jwtService.checkRefreshToken(refreshTokenInCookie);
        const findTokenInData = await this.refreshTokenModel.findOne({ refreshToken: refreshTokenInCookie }).lean();
        if (refreshTokenInCookie && checkRefreshToken !== false && findTokenInData !== null) {
            await this.refreshTokenModel.findOneAndDelete({ refreshToken: refreshTokenInCookie });
            throw new common_1.HttpException("Logout succefully, bye!", common_1.HttpStatus.NO_CONTENT);
        }
        else {
            throw new common_1.HttpException("Sorry, you already logout, repeat authorization", common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async passwordRecovery(req, user) {
        await this.authService.informationAboutRecoveryPassword(req.ip, user.email);
        const checkAttemptRecoveryPassword = await this.authService.counterAttemptRecoveryPassword(req.ip, user.email);
        if (checkAttemptRecoveryPassword) {
            const createRecoveryPassword = await this.usersService.passwordRecovery(user.email);
            if (createRecoveryPassword) {
                await this.emailService.emailPasswordRecovery(user.email);
                throw new common_1.HttpException("Just 204", common_1.HttpStatus.NO_CONTENT);
            }
            else {
                throw new common_1.HttpException("Just 204", common_1.HttpStatus.NO_CONTENT);
            }
        }
        else {
            throw new common_1.HttpException("To many requests", common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    async newPassword(req, newPasswordEntity) {
        await this.authService.informationAboutNewPassword(req.ip, newPasswordEntity.recoveryCode);
        const checkAttemptNewPassword = await this.authService.counterAttemptNewPassword(req.ip, newPasswordEntity.recoveryCode);
        if (checkAttemptNewPassword) {
            const result = await this.usersService.createNewPassword(newPasswordEntity.newPassword, newPasswordEntity.recoveryCode);
            if (result) {
                throw new common_1.HttpException("Just 204", common_1.HttpStatus.NO_CONTENT);
            }
            else {
                throw new common_1.HttpException(`{ errorsMessages: [{ message: Any<String>, field: "${newPasswordEntity.recoveryCode}" }] }`, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        else {
            console.log("429");
            throw new common_1.HttpException("To many requests", common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    async aboutMe(req) {
        const foundUser = await this.usersRepository.findUserByLoginForMe(req.user.login);
        return foundUser;
    }
    async getRegistrationDate() {
        const registrationData = await this.usersRepository.getRegistrationDate();
        return registrationData;
    }
    async getAuthDate() {
        const authData = await this.usersRepository.getAuthDate();
        return authData;
    }
    async getConfirmDate() {
        const confrimData = await this.usersRepository.getConfirmAttemptDate();
        return confrimData;
    }
    async getEmailDate() {
        const emailSendData = await this.usersRepository.getEmailSendDate();
        return emailSendData;
    }
    async getTokenDate() {
        const TokenData = await this.usersRepository.getTokenDate();
        return TokenData;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AuthForm_validator_1.AuthForm, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authorization", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateAccessToken", null);
__decorate([
    (0, common_1.Post)('registration'),
    (0, common_1.UseGuards)(users_registration_guard_1.UserRegistrationFlow),
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthForm_validator_1.AuthForm, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registration", null);
__decorate([
    (0, common_1.Post)('registration-confirmation'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registrationConfirmation", null);
__decorate([
    (0, common_1.Post)('registration-email-resending'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registrationEmailResending", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Post)('password-recovery'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, EmailForRecoveryPassword_Validator_1.EmailForRecoveryPassword]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passwordRecovery", null);
__decorate([
    (0, common_1.UseFilters)(new exception_filter_1.HttpExceptionFilter()),
    (0, common_1.Post)('new-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, NewPassword_Validator_1.NewPassword]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "newPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "aboutMe", null);
__decorate([
    (0, common_1.Get)('get-registration-date'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getRegistrationDate", null);
__decorate([
    (0, common_1.Get)('get-auth-date'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAuthDate", null);
__decorate([
    (0, common_1.Get)('get-confirm-date'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getConfirmDate", null);
__decorate([
    (0, common_1.Get)('get-email-date'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getEmailDate", null);
__decorate([
    (0, common_1.Get)('get-token-date'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getTokenDate", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __param(5, (0, mongoose_1.InjectModel)('RefreshToken')),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        users_service_1.UsersService,
        auth_service_1.AuthService,
        email_service_1.EmailService,
        jwt_service_1.JwtServiceClass,
        mongoose_2.Model])
], AuthController);
//# sourceMappingURL=auth.controller.js.map