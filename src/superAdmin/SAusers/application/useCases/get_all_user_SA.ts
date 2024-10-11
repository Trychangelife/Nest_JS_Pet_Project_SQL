import { CommandHandler } from "@nestjs/cqrs"
import { SuperAdminUsersRepository } from "../../repositories/SuperAdmin.user.repository"
import { BanStatus } from "src/superAdmin/SAblog/dto/banStatus"

export class GetAllUsersAsSuperAdminCommand {
    constructor(
        public pageSize: number, 
        public pageNumber: number, 
        public sortDirection?: string,
        public sortBy?: string, 
        public searchEmailTerm?: string, 
        public searchLoginTerm?: string,
        public banStatus?: BanStatus) {
        
    }
}

@CommandHandler(GetAllUsersAsSuperAdminCommand)
export class GetAllUsersAsSuperAdminUseCase {
    constructor (protected usersRepository: SuperAdminUsersRepository ) {}

    async execute(command: GetAllUsersAsSuperAdminCommand): Promise<object> {
        let skip = 0
        if (command.pageNumber && command.pageSize) {
            skip = (command.pageNumber - 1) * command.pageSize
        }
        return await this.usersRepository.allUsers(skip, command.pageSize, command.sortDirection, command.sortBy ,command.pageNumber, command.searchEmailTerm, command.searchLoginTerm, command.banStatus)
    }
}


