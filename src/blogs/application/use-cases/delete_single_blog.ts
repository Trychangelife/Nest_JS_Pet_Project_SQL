import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepositorySql } from "src/blogs/repositories/blogs.sql.repository"



export class DeleteBlogCommand {
    constructor(public id: string) {
        
    }
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase {
    constructor (protected bloggerRepository: BlogsRepositorySql ) {}

    async execute(command: DeleteBlogCommand): Promise<string> {
        const result = await this.bloggerRepository.deleteBlogger(command.id)
        if (result == true) {
            return "204"
        }
        else {
            return "404"
        }
    }
}


