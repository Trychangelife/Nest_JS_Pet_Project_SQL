"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserSAUseCase = exports.CreateUserSACommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const email_service_1 = require("../../../../email/email.service");
const bcrypt = __importStar(require("bcrypt"));
const mongodb_1 = require("mongodb");
const UserClass_1 = require("../../../../users/dto/UserClass");
const uuid_1 = require("uuid");
const SuperAdmin_user_repository_1 = require("../../repositories/SuperAdmin.user.repository");
class CreateUserSACommand {
    constructor(password, login, email, ip) {
        this.password = password;
        this.login = login;
        this.email = email;
        this.ip = ip;
    }
}
exports.CreateUserSACommand = CreateUserSACommand;
let CreateUserSAUseCase = class CreateUserSAUseCase {
    constructor(usersRepository, emailService) {
        this.usersRepository = usersRepository;
        this.emailService = emailService;
    }
    async execute(command) {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(command.password, passwordSalt);
        const newUser = new UserClass_1.User(new mongodb_1.ObjectId(), (0, uuid_1.v4)(), command.login, command.email, (new Date()).toISOString(), { passwordHash, passwordSalt }, { codeForActivated: (0, uuid_1.v4)(), activatedStatus: false }, { codeForRecovery: null, createdDateRecoveryCode: null }, { isBanned: false, banDate: null, banReason: null });
        const registrationData = {
            ip: command.ip,
            dateRegistation: new Date(),
            email: command.email
        };
        const checkScam = await this.usersRepository.ipAddressIsScam(command.ip);
        if (checkScam == true) {
            if (await this.usersRepository.findUserByLogin(command.login) !== null || await this.usersRepository.findUserByEmail(command.email) !== null) {
                return false;
            }
            else {
                const createdUser = await this.usersRepository.createUser(newUser);
                this.emailService.emailConfirmation(newUser.email);
                return createdUser;
            }
        }
        return null;
    }
    async _generateHash(password, salt) {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
};
exports.CreateUserSAUseCase = CreateUserSAUseCase;
exports.CreateUserSAUseCase = CreateUserSAUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(CreateUserSACommand),
    __metadata("design:paramtypes", [SuperAdmin_user_repository_1.SuperAdminUsersRepository, email_service_1.EmailService])
], CreateUserSAUseCase);
//# sourceMappingURL=create_user_SA.js.map