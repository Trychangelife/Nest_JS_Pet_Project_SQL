import { UsersType } from "src/users/dto/UsersType";
import { UsersRepository } from "src/users/repositories/users.repository";
export declare class AuthService {
    protected usersRepository: UsersRepository;
    constructor(usersRepository: UsersRepository);
    ipAddressIsScam(ip: string, login: string): Promise<boolean>;
    refreshActivationCode(email: string): Promise<UsersType | null>;
    counterAttemptAuth(ip: string, login: string): Promise<boolean>;
    counterAttemptConfirm(ip: string, code: string): Promise<boolean>;
    counterAttemptEmail(ip: string, email: string): Promise<boolean>;
    counterAttemptRecoveryPassword(ip: string, email: string): Promise<boolean>;
    counterAttemptNewPassword(ip: string, code: string): Promise<boolean>;
    informationAboutAuth(ip: string, login: string): Promise<boolean>;
    informationAboutConfirmed(ip: string, code: string): Promise<boolean>;
    informationAboutEmailSend(ip: string, email: string): Promise<boolean>;
    informationAboutRecoveryPassword(ip: string, email: string): Promise<boolean>;
    informationAboutNewPassword(ip: string, code: string): Promise<boolean>;
}
