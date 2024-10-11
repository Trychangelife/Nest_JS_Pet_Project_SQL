import { SuperAdminUsersRepository } from "../../repositories/SuperAdmin.user.repository";
import { BanStatus } from "src/superAdmin/SAblog/dto/banStatus";
export declare class GetAllUsersAsSuperAdminCommand {
    pageSize: number;
    pageNumber: number;
    sortDirection?: string;
    sortBy?: string;
    searchEmailTerm?: string;
    searchLoginTerm?: string;
    banStatus?: BanStatus;
    constructor(pageSize: number, pageNumber: number, sortDirection?: string, sortBy?: string, searchEmailTerm?: string, searchLoginTerm?: string, banStatus?: BanStatus);
}
export declare class GetAllUsersAsSuperAdminUseCase {
    protected usersRepository: SuperAdminUsersRepository;
    constructor(usersRepository: SuperAdminUsersRepository);
    execute(command: GetAllUsersAsSuperAdminCommand): Promise<object>;
}
