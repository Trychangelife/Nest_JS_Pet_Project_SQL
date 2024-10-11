import { CommandHandler } from "@nestjs/cqrs"
import { BlogsByBloggerRepository } from "src/bloggers/repositories/bloggers.repository"



export class DeleteBlogForSpecificBloggerCommand {
    constructor(public blogId: string, public userId: string) {
        
    }
}

@CommandHandler(DeleteBlogForSpecificBloggerCommand)
export class DeleteBlogForSpecificBloggerUseCase {
    constructor (protected bloggerRepository: BlogsByBloggerRepository ) {}

    async execute(command: DeleteBlogForSpecificBloggerCommand): Promise<boolean> {
        const result = await this.bloggerRepository.deleteBlogForSpecificBlogger(command.blogId, command.userId)
        return result
    }
}


