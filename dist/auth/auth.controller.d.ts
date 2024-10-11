import { EmailService } from "../email/email.service";
import { UsersRepository } from "../users/repositories/users.repository";
import { UsersService } from "../users/application/users.service";
import { AuthService } from "./application/auth.service";
import { RefreshTokenStorageType } from "../utils/types";
import { UsersType } from "src/users/dto/UsersType";
import { JwtServiceClass } from "../guards/jwt.service";
import { Model } from "mongoose";
import { AuthForm } from "src/auth/dto/AuthForm_validator";
import { EmailForRecoveryPassword } from "./dto/EmailForRecoveryPassword_Validator";
import { NewPassword } from "./dto/NewPassword_Validator";
export declare class AuthController {
    protected usersRepository: UsersRepository;
    protected usersService: UsersService;
    protected authService: AuthService;
    protected emailService: EmailService;
    protected jwtService: JwtServiceClass;
    protected refreshTokenModel: Model<RefreshTokenStorageType>;
    constructor(usersRepository: UsersRepository, usersService: UsersService, authService: AuthService, emailService: EmailService, jwtService: JwtServiceClass, refreshTokenModel: Model<RefreshTokenStorageType>);
    authorization(req: any, DataUser: AuthForm, res: any): Promise<void>;
    updateAccessToken(req: any, res: any): Promise<void>;
    registration(user: AuthForm, req: {
        ip: string;
    }, res: any): Promise<void>;
    registrationConfirmation(body: {
        code: string;
    }, req: {
        ip: string;
    }, res: any): Promise<void>;
    registrationEmailResending(user: {
        password: string;
        login: string;
        email: string;
    }, req: {
        ip: string;
    }): Promise<void>;
    logout(req: any): Promise<void>;
    passwordRecovery(req: any, user: EmailForRecoveryPassword): Promise<void>;
    newPassword(req: any, newPasswordEntity: NewPassword): Promise<void>;
    aboutMe(req: any): Promise<any[] | UsersType>;
    getRegistrationDate(): Promise<import("../utils/types").RegistrationDataType[]>;
    getAuthDate(): Promise<import("../utils/types").AuthDataType[]>;
    getConfirmDate(): Promise<import("../utils/types").ConfirmedAttemptDataType[]>;
    getEmailDate(): Promise<import("../utils/types").EmailSendDataType[]>;
    getTokenDate(): Promise<RefreshTokenStorageType[]>;
}
