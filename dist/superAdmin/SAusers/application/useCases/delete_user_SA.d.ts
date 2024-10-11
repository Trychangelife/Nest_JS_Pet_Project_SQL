import { SuperAdminUsersRepository } from "../../repositories/SuperAdmin.user.repository";
export declare class DeleteUserAsSuperAdminCommand {
    id: string;
    constructor(id: string);
}
export declare class DeleteUserAsSuperAdminUseCase {
    protected usersRepository: SuperAdminUsersRepository;
    constructor(usersRepository: SuperAdminUsersRepository);
    execute(command: DeleteUserAsSuperAdminCommand): Promise<boolean>;
}
