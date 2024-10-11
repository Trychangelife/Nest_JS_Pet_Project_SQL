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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const mongodb_1 = require("mongodb");
const email_service_1 = require("../../email/email.service");
const users_repository_1 = require("../repositories/users.repository");
const uuid_1 = require("uuid");
const UserClass_1 = require("../dto/UserClass");
let UsersService = class UsersService {
    constructor(usersRepository, emailService) {
        this.usersRepository = usersRepository;
        this.emailService = emailService;
    }
    async allUsers(pageSize, pageNumber, sortDirection, sortBy, searchEmailTerm, searchLoginTerm) {
        let skip = 0;
        if (pageNumber && pageSize) {
            skip = (pageNumber - 1) * pageSize;
        }
        return await this.usersRepository.allUsers(skip, pageSize, sortDirection, sortBy, pageNumber, searchEmailTerm, searchLoginTerm);
    }
    async createNewPassword(password, recoveryCode) {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt);
        return await this.usersRepository.createNewPassword(passwordHash, passwordSalt, recoveryCode);
    }
    async createUser(password, login, email, ip) {
        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(password, passwordSalt);
        const newUser = new UserClass_1.User(new mongodb_1.ObjectId(), (0, uuid_1.v4)(), login, email, (new Date()).toISOString(), { passwordHash, passwordSalt }, { codeForActivated: (0, uuid_1.v4)(), activatedStatus: false });
        const registrationData = {
            ip,
            dateRegistation: new Date(),
            email
        };
        await this.usersRepository.informationAboutRegistration(registrationData);
        const checkScam = await this.usersRepository.ipAddressIsScam(ip);
        if (checkScam == true) {
            if (await this.usersRepository.findUserByLogin(login) !== null || await this.usersRepository.findUserByEmail(email) !== null) {
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
    async deleteUser(id) {
        return await this.usersRepository.deleteUser(id);
    }
    async _generateHash(password, salt) {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
    async checkCredentials(login, password) {
        const user = await this.usersRepository.findUserByLogin(login);
        const user2 = await this.usersRepository.findUserByEmail(login);
        if (!user && !user2)
            return false;
        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt);
        if (user.accountData.passwordHash !== passwordHash) {
            return false;
        }
        return true;
    }
    async findUserById(id) {
        return await this.usersRepository.findUserById(id);
    }
    async confirmationEmail(code) {
        let user = await this.usersRepository.findUserByConfirmationCode(code);
        if (user) {
            return await this.usersRepository.confirmationEmail(user);
        }
        else {
            return false;
        }
    }
    async passwordRecovery(email) {
        const foundUser = await this.usersRepository.findUserByEmail(email);
        if (foundUser !== null) {
            const codeRecoveryPassword = (0, uuid_1.v4)();
            return await this.usersRepository.passwordRecovery(email, codeRecoveryPassword);
        }
        else {
            return false;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository, email_service_1.EmailService])
], UsersService);
//# sourceMappingURL=users.service.js.map