import { CanActivate, ExecutionContext } from "@nestjs/common";
import { UsersRepository } from "src/users/repositories/users.repository";
export declare class UserConfirmationFlow implements CanActivate {
    usersRepository: UsersRepository;
    constructor(usersRepository: UsersRepository);
    canActivate(context: ExecutionContext): Promise<boolean> | null;
}
