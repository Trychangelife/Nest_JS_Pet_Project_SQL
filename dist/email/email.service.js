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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const email_manager_1 = require("./email.manager");
let EmailService = class EmailService {
    constructor(usersModel, emailManager) {
        this.usersModel = usersModel;
        this.emailManager = emailManager;
    }
    async emailConfirmation(email) {
        const foundUser = await this.usersModel.findOne({ email: email }).lean();
        const statusAccount = await this.usersModel.findOne({ email: email, 'emailConfirmation.activatedStatus': false }).lean();
        if (foundUser !== null && statusAccount !== null) {
            return await this.emailManager.sendEmailConfirmation(foundUser);
        }
        else {
            return false;
        }
    }
    async emailPasswordRecovery(email) {
        const foundUser = await this.usersModel.findOne({ email: email }).lean();
        const statusAccount = await this.usersModel.findOne({ email: email, 'emailConfirmation.activatedStatus': false }).lean();
        if (foundUser !== null && statusAccount !== null) {
            return await this.emailManager.sendEmailRecoveryPassword(foundUser);
        }
        else {
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Users')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        email_manager_1.EmailManager])
], EmailService);
//# sourceMappingURL=email.service.js.map