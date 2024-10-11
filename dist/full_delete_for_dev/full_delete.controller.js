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
exports.FullDataController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let FullDataController = class FullDataController {
    constructor(postsModel, bloggerModel, commentsModel, usersModel, registrationDataModel, authDataModel, codeConfirmModel, emailSendModel, refreshTokenModel, newPasswordModel, recoveryPasswordModel) {
        this.postsModel = postsModel;
        this.bloggerModel = bloggerModel;
        this.commentsModel = commentsModel;
        this.usersModel = usersModel;
        this.registrationDataModel = registrationDataModel;
        this.authDataModel = authDataModel;
        this.codeConfirmModel = codeConfirmModel;
        this.emailSendModel = emailSendModel;
        this.refreshTokenModel = refreshTokenModel;
        this.newPasswordModel = newPasswordModel;
        this.recoveryPasswordModel = recoveryPasswordModel;
    }
    async deleteAllData() {
        await this.postsModel.deleteMany();
        await this.bloggerModel.deleteMany();
        await this.usersModel.deleteMany();
        await this.commentsModel.deleteMany();
        await this.registrationDataModel.deleteMany();
        await this.authDataModel.deleteMany();
        await this.codeConfirmModel.deleteMany();
        await this.emailSendModel.deleteMany();
        await this.refreshTokenModel.deleteMany();
        await this.newPasswordModel.deleteMany();
        await this.recoveryPasswordModel.deleteMany();
        throw new common_1.HttpException("Date is clear", common_1.HttpStatus.NO_CONTENT);
    }
};
exports.FullDataController = FullDataController;
__decorate([
    (0, common_1.Delete)('all-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FullDataController.prototype, "deleteAllData", null);
exports.FullDataController = FullDataController = __decorate([
    (0, common_1.Controller)('testing'),
    __param(0, (0, mongoose_1.InjectModel)('Posts')),
    __param(1, (0, mongoose_1.InjectModel)('Blogs')),
    __param(2, (0, mongoose_1.InjectModel)('Comments')),
    __param(3, (0, mongoose_1.InjectModel)('Users')),
    __param(4, (0, mongoose_1.InjectModel)('RegistrationData')),
    __param(5, (0, mongoose_1.InjectModel)('AuthData')),
    __param(6, (0, mongoose_1.InjectModel)('CodeConfirm')),
    __param(7, (0, mongoose_1.InjectModel)('EmailSend')),
    __param(8, (0, mongoose_1.InjectModel)('RefreshToken')),
    __param(9, (0, mongoose_1.InjectModel)('NewPassword')),
    __param(10, (0, mongoose_1.InjectModel)('RecoveryPassword')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], FullDataController);
//# sourceMappingURL=full_delete.controller.js.map