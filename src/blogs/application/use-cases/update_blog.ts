import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepositorySql } from "src/blogs/repositories/blogs.sql.repository"



export class UpdateBlogCommand {
    constructor(public id: string, public name: any, public websiteUrl: string, public description: string) {
        
    }
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase {
    constructor (protected bloggerRepository: BlogsRepositorySql ) {}

    async execute(command: UpdateBlogCommand): Promise<boolean> {
        const afterUpdate = await this.bloggerRepository.changeBlogger(command.id, command.name, command.websiteUrl, command.description)
        return afterUpdate
    }
}


