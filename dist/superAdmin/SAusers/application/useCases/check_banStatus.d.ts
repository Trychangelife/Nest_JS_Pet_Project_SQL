import { SuperAdminUsersRepository } from "../../repositories/SuperAdmin.user.repository";
export declare class CheckBanStatusSuperAdminCommand {
    userId?: string;
    blogId?: string;
    constructor(userId?: string, blogId?: string);
}
export declare class CheckBanStatusSuperAdminUseCase {
    protected usersRepository: SuperAdminUsersRepository;
    constructor(usersRepository: SuperAdminUsersRepository);
    execute(command: CheckBanStatusSuperAdminCommand): Promise<boolean | null>;
}
