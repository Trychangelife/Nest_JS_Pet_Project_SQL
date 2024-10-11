import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepository } from "src/blogs/repositories/blogs.repository"



export class DeleteBlogCommand {
    constructor(public id: string) {
        
    }
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase {
    constructor (protected bloggerRepository: BlogsRepository ) {}

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


