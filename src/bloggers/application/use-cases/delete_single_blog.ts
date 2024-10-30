import { CommandHandler } from "@nestjs/cqrs"
import { BlogsByBloggerRepository } from "src/bloggers/repositories/bloggers.repository"
import { BlogsRepositorySql } from "src/blogs/repositories/blogs.sql.repository"



export class DeleteBlogForSpecificBloggerCommand {
    constructor(public blogId: string, public userId: string) {
        
    }
}

@CommandHandler(DeleteBlogForSpecificBloggerCommand)
export class DeleteBlogForSpecificBloggerUseCase {
    constructor (protected bloggerRepository: BlogsRepositorySql ) {}

    // async execute(command: DeleteBlogForSpecificBloggerCommand): Promise<boolean> {
    //     const result = await this.bloggerRepository.deleteBlogForSpecificBlogger(command.blogId, command.userId)
    //     return result
    // }
}


