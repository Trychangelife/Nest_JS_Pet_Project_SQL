import { CommandBus, CommandHandler } from "@nestjs/cqrs"
import { BlogsSuperAdminRepository } from "../repositories/blogs.SA.repository"
import { GetUserByUserIdCommand } from "src/users/application/use-cases/Get_user_by_id"


export class BindingBlogSuperAdminCommand {
    constructor(
        public blogId: string,
        public userId: string) {
        
    }
}

@CommandHandler(BindingBlogSuperAdminCommand)
export class BindingBlogSuperAdminUseCase {
    constructor (protected blogsSuperAdminRepository: BlogsSuperAdminRepository, public commandBus: CommandBus) {}

    async execute(command: BindingBlogSuperAdminCommand): Promise<boolean> {
        const user = await this.commandBus.execute(new GetUserByUserIdCommand(command.userId))
        return this.blogsSuperAdminRepository.BindingBlogToUserById(command.blogId, command.userId, user)
    }
}


