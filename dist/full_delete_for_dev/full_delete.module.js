"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullDeleteModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const db_1 = require("../db");
const full_delete_controller_1 = require("./full_delete.controller");
let FullDeleteModule = class FullDeleteModule {
};
exports.FullDeleteModule = FullDeleteModule;
exports.FullDeleteModule = FullDeleteModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: 'Blogger', schema: db_1.blogsSchema },
                { name: 'Posts', schema: db_1.postSchema },
                { name: 'Comments', schema: db_1.commentsSchema },
                { name: 'Users', schema: db_1.usersSchema },
                { name: 'RegistrationData', schema: db_1.registrationDataSchema },
                { name: 'AuthData', schema: db_1.authDataSchema },
                { name: 'CodeConfirm', schema: db_1.codeConfirmSchema },
                { name: 'EmailSend', schema: db_1.emailSendSchema },
                { name: 'RefreshToken', schema: db_1.refreshTokenSchema },
                { name: 'RecoveryPassword', schema: db_1.recoveryPasswordSchema },
                { name: 'NewPassword', schema: db_1.newPasswordSchema }
            ])],
        controllers: [full_delete_controller_1.FullDataController],
        providers: [],
    })
], FullDeleteModule);
//# sourceMappingURL=full_delete.module.js.map