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
exports.EmailManager = void 0;
const common_1 = require("@nestjs/common");
const email_adapter_1 = require("./email.adapter");
let EmailManager = class EmailManager {
    constructor(emailAdapter) {
        this.emailAdapter = emailAdapter;
    }
    async sendEmailConfirmation(user) {
        const url = `${process.env.HOSTING_URL}/auth/registration-confirmation`;
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href='${url}?code=${user.emailConfirmation.codeForActivated}'>complete registration</a>
        </p>`;
        return this.emailAdapter.sendEmailConfirmation(user.email, message, 'Email Confirmation after registration');
    }
    async sendEmailRecoveryPassword(user) {
        const url = `${process.env.HOSTING_URL}/auth/password-recovery`;
        const message = `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
            <a href='${url}?recoveryCode=${user.recoveryPasswordInformation.codeForRecovery}'>recovery password</a>
        </p>`;
        return this.emailAdapter.sendEmailConfirmation(user.email, message, 'Password recovery');
    }
};
exports.EmailManager = EmailManager;
exports.EmailManager = EmailManager = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_adapter_1.EmailAdapter])
], EmailManager);
//# sourceMappingURL=email.manager.js.map