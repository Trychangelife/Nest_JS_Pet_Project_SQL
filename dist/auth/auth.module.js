"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("../users/repositories/users.repository");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./application/auth.service");
const db_1 = require("../db");
const mongoose_1 = require("@nestjs/mongoose");
const users_service_1 = require("../users/application/users.service");
const email_service_1 = require("../email/email.service");
const jwt_service_1 = require("../guards/jwt.service");
const jwt_1 = require("@nestjs/jwt");
const email_manager_1 = require("../email/email.manager");
const email_adapter_1 = require("../email/email.adapter");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: 'Users', schema: db_1.usersSchema },
                { name: 'RegistrationData', schema: db_1.registrationDataSchema },
                { name: 'AuthData', schema: db_1.authDataSchema },
                { name: 'CodeConfirm', schema: db_1.codeConfirmSchema },
                { name: 'EmailSend', schema: db_1.emailSendSchema },
                { name: 'RefreshToken', schema: db_1.refreshTokenSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '24h'
                }
            })],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, users_repository_1.UsersRepository, users_service_1.UsersService, email_service_1.EmailService, jwt_service_1.JwtServiceClass, email_manager_1.EmailManager, email_adapter_1.EmailAdapter],
        exports: [jwt_service_1.JwtServiceClass, jwt_1.JwtModule]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map