import { CommandHandler } from "@nestjs/cqrs"
import { SuperAdminUsersRepository } from "../../repositories/SuperAdmin.user.repository"

export class DeleteUserAsSuperAdminCommand {
    constructor(
        public id: string) {
        
    }
}

@CommandHandler(DeleteUserAsSuperAdminCommand)
export class DeleteUserAsSuperAdminUseCase {
    constructor (protected usersRepository: SuperAdminUsersRepository ) {}

    async execute(command: DeleteUserAsSuperAdminCommand): Promise<boolean> {
        return await this.usersRepository.deleteUser(command.id)
    }
}


