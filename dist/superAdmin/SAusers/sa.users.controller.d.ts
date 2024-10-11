import { CommandBus } from "@nestjs/cqrs";
import { AuthForm } from "src/auth/dto/AuthForm_validator";
import { BanUserInputModel } from "./dto/banUserInputModel";
import { BanStatus } from "../SAblog/dto/banStatus";
export declare class SuperAdminUsersController {
    private commandBus;
    constructor(commandBus: CommandBus);
    createUser(user: AuthForm, req: {
        ip: string;
    }, res: any): Promise<void>;
    getAllUsers(query: {
        searchEmailTerm: string;
        searchLoginTerm: string;
        pageNumber: string;
        pageSize: string;
        sortBy: string;
        sortDirection: string;
        banStatus: BanStatus;
    }): Promise<any>;
    deleteUserById(id: string): Promise<void>;
    banUser(id: string, banInputModel: BanUserInputModel): Promise<void>;
}
