import { UsersType } from "src/users/dto/UsersType";
import { UsersService } from "./application/users.service";
import { AuthForm } from "src/auth/dto/AuthForm_validator";
export declare class UsersController {
    protected usersService: UsersService;
    constructor(usersService: UsersService);
    getAllUsers(query: {
        searchEmailTerm: string;
        searchLoginTerm: string;
        pageNumber: string;
        pageSize: string;
        sortBy: string;
        sortDirection: string;
    }): Promise<object>;
    createUser(user: AuthForm, req: {
        ip: string;
    }): Promise<true | UsersType>;
    deleteUserById(id: string): Promise<void>;
    getUserById(id: string): Promise<UsersType>;
}
