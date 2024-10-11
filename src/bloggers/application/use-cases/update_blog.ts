import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepository } from "src/blogs/repositories/blogs.repository"



export class UpdateBlogByBloggerCommand {
    constructor(public id: string, public name: any, public websiteUrl: string, public description: string) {
        
    }
}

@CommandHandler(UpdateBlogByBloggerCommand)
export class UpdateBlogByBloggerUseCase {
    constructor (protected bloggerRepository: BlogsRepository ) {}

    async execute(command: UpdateBlogByBloggerCommand): Promise<string> {
        const afterUpdate = await this.bloggerRepository.changeBlogger(command.id, command.name, command.websiteUrl, command.description)
        if (afterUpdate == true) {
            return "update";
        }
        else {
            return "404"
        }
    }
}


