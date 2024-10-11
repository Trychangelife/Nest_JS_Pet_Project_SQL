import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepository } from "src/blogs/repositories/blogs.repository"



export class UpdateBlogCommand {
    constructor(public id: string, public name: any, public websiteUrl: string, public description: string) {
        
    }
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase {
    constructor (protected bloggerRepository: BlogsRepository ) {}

    async execute(command: UpdateBlogCommand): Promise<string> {
        const afterUpdate = await this.bloggerRepository.changeBlogger(command.id, command.name, command.websiteUrl, command.description)
        if (afterUpdate == true) {
            return "update";
        }
        else {
            return "404"
        }
    }
}


