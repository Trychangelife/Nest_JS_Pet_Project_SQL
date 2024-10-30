import { CommandHandler } from "@nestjs/cqrs"
import { UsersType } from "src/users/dto/UsersType"
import { UsersRepository } from "src/users/repositories/users.repository"


export class GetUserByUserIdCommand {
    constructor(public userId: string) {
        
    }
}

@CommandHandler(GetUserByUserIdCommand)
export class GetUserByUserIdUseCase {
    constructor (protected usersRepository: UsersRepository ) {}

    async execute(command: GetUserByUserIdCommand): Promise<UsersType | null> {
        return await this.usersRepository.findUserById(command.userId)
    }
}


