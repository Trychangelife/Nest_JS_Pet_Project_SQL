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
exports.UserRegistrationFlow = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("../users/repositories/users.repository");
let UserRegistrationFlow = class UserRegistrationFlow {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const login = request.body.login;
        const email = request.body.email;
        const code = request.body.code;
        const userWithExistingEmail = await this.usersRepository.findUserByEmail(email);
        const userWithExistingLogin = await this.usersRepository.findUserByLogin(login);
        if (userWithExistingEmail) {
            const errorResponseForEmail = {
                errorsMessages: [
                    {
                        message: 'email already exist',
                        field: "email",
                    }
                ]
            };
            throw new common_1.BadRequestException(errorResponseForEmail);
        }
        else if (userWithExistingLogin) {
            const errorResponseForLogin = {
                errorsMessages: [
                    {
                        message: 'login already exist',
                        field: "login",
                    }
                ]
            };
            throw new common_1.BadRequestException(errorResponseForLogin);
        }
        else {
            return true;
        }
    }
};
exports.UserRegistrationFlow = UserRegistrationFlow;
exports.UserRegistrationFlow = UserRegistrationFlow = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UserRegistrationFlow);
//# sourceMappingURL=users.registration.guard.js.map