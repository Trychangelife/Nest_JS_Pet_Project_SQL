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
exports.EmailAdapter = void 0;
const mailer_1 = require("@nest-modules/mailer");
const common_1 = require("@nestjs/common");
let EmailAdapter = class EmailAdapter {
    constructor(mailerService) {
        this.mailerService = mailerService;
    }
    async sendEmailConfirmation(email, message, subject) {
        return await this.mailerService.sendMail({
            from: 'Evgeniy <jenbka999@gmail.com>',
            to: email,
            subject: subject,
            html: message
        }).catch((e) => {
            throw new common_1.HttpException(`Ошибка работы почты: ${JSON.stringify(e)}`, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
};
exports.EmailAdapter = EmailAdapter;
exports.EmailAdapter = EmailAdapter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailAdapter);
//# sourceMappingURL=email.adapter.js.map