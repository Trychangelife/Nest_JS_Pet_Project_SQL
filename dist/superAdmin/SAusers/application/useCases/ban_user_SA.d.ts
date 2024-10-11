import { SuperAdminUsersRepository } from "../../repositories/SuperAdmin.user.repository";
export declare class BanUserAsSuperAdminCommand {
    id: string;
    reason: string;
    isBanned: boolean;
    constructor(id: string, reason: string, isBanned: boolean);
}
export declare class BanUserAsSuperAdminUseCase {
    protected usersRepository: SuperAdminUsersRepository;
    constructor(usersRepository: SuperAdminUsersRepository);
    execute(command: BanUserAsSuperAdminCommand): Promise<boolean>;
}
