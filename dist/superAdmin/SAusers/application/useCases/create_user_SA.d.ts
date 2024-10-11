import { EmailService } from "src/email/email.service";
import { UsersType } from "src/users/dto/UsersType";
import { SuperAdminUsersRepository } from "../../repositories/SuperAdmin.user.repository";
export declare class CreateUserSACommand {
    password: string;
    login: string;
    email: string;
    ip: string;
    constructor(password: string, login: string, email: string, ip: string);
}
export declare class CreateUserSAUseCase {
    protected usersRepository: SuperAdminUsersRepository;
    protected emailService: EmailService;
    constructor(usersRepository: SuperAdminUsersRepository, emailService: EmailService);
    execute(command: CreateUserSACommand): Promise<UsersType | null | boolean>;
    _generateHash(password: string, salt: string): Promise<string>;
}
