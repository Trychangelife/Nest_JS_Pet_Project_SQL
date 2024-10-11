import { UsersType } from "src/users/dto/UsersType";
import { UsersRepository } from "src/users/repositories/users.repository";
export declare class GetUserByUserIdCommand {
    userId: string;
    constructor(userId: string);
}
export declare class GetUserByUserIdUseCase {
    protected usersRepository: UsersRepository;
    constructor(usersRepository: UsersRepository);
    execute(command: GetUserByUserIdCommand): Promise<UsersType | null>;
}
