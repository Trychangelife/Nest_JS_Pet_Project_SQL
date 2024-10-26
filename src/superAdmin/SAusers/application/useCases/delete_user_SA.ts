import { CommandHandler } from "@nestjs/cqrs"
import { SuperAdminUsersRepositorySql } from "../../repositories/SuperAdmin.user.repositorySQL"

export class DeleteUserAsSuperAdminCommand {
    constructor(
        public id: string) {
        
    }
}

@CommandHandler(DeleteUserAsSuperAdminCommand)
export class DeleteUserAsSuperAdminUseCase {
    constructor (protected usersRepository: SuperAdminUsersRepositorySql ) {}

    async execute(command: DeleteUserAsSuperAdminCommand): Promise<boolean> {
        return await this.usersRepository.deleteUser(command.id)
    }
}


