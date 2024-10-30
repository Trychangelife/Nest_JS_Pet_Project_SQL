import { CommandHandler } from "@nestjs/cqrs"
import { SuperAdminUsersRepositorySql } from "../../repositories/SuperAdmin.user.repositorySQL"

export class BanUserAsSuperAdminCommand {
    constructor(
        public id: string,
        public reason: string,
        public isBanned: boolean) {
        
    }
}

@CommandHandler(BanUserAsSuperAdminCommand)
export class BanUserAsSuperAdminUseCase {
    constructor (protected usersRepository: SuperAdminUsersRepositorySql ) {}

    async execute(command: BanUserAsSuperAdminCommand): Promise<boolean> {
        return await this.usersRepository.banUser(command.id, command.reason, command.isBanned)
    }
}


