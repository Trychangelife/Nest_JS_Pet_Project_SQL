import { CommandHandler } from "@nestjs/cqrs"
import { SuperAdminUsersRepository } from "../../repositories/SuperAdmin.user.repository"

export class CheckBanStatusSuperAdminCommand {
    constructor(
        public userId?: string,
        public blogId?: string) {
        
    }
}

@CommandHandler(CheckBanStatusSuperAdminCommand)
export class CheckBanStatusSuperAdminUseCase {
    constructor (protected usersRepository: SuperAdminUsersRepository ) {}

    async execute(command: CheckBanStatusSuperAdminCommand): Promise<boolean | null> {
        if (command.userId) {
            const checkResult = await this.usersRepository.checkBanStatus(command.userId, null)
            return checkResult
        }
        if (command.blogId) {
            const checkResult = await this.usersRepository.checkBanStatus(null, command.blogId)
            return checkResult
        }
    }
}


