import { EmailService } from "../../email/email.service";
import { UsersType } from "src/users/dto/UsersType";
import { UsersRepository } from "../repositories/users.repository";
export declare class UsersService {
    protected usersRepository: UsersRepository;
    protected emailService: EmailService;
    constructor(usersRepository: UsersRepository, emailService: EmailService);
    allUsers(pageSize: number, pageNumber: number, sortDirection: string, sortBy: string, searchEmailTerm: string, searchLoginTerm: string): Promise<object>;
    createNewPassword(password: string, recoveryCode: string): Promise<null | boolean>;
    createUser(password: string, login: string, email: string, ip: string): Promise<UsersType | null | boolean>;
    deleteUser(id: string): Promise<boolean>;
    _generateHash(password: string, salt: string): Promise<string>;
    checkCredentials(login: string, password: string): Promise<boolean>;
    findUserById(id: string): Promise<UsersType | null>;
    confirmationEmail(code: string): Promise<boolean>;
    passwordRecovery(email: string): Promise<boolean>;
}
