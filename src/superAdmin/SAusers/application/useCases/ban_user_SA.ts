import { CommandHandler } from "@nestjs/cqrs"
import { SuperAdminUsersRepository } from "../../repositories/SuperAdmin.user.repository"

export class BanUserAsSuperAdminCommand {
    constructor(
        public id: string,
        public reason: string,
        public isBanned: boolean) {
        
    }
}

@CommandHandler(BanUserAsSuperAdminCommand)
export class BanUserAsSuperAdminUseCase {
    constructor (protected usersRepository: SuperAdminUsersRepository ) {}

    async execute(command: BanUserAsSuperAdminCommand): Promise<boolean> {
        return await this.usersRepository.banUser(command.id, command.reason, command.isBanned)
    }
}


