import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepositorySql } from "src/blogs/repositories/blogs.sql.repository"



export class UpdateBlogByBloggerCommand {
    constructor(public id: string, public name: any, public websiteUrl: string, public description: string) {
        
    }
}

@CommandHandler(UpdateBlogByBloggerCommand)
export class UpdateBlogByBloggerUseCase {
    constructor (protected bloggerRepository: BlogsRepositorySql ) {}

    // async execute(command: UpdateBlogByBloggerCommand): Promise<string> {
    //     const afterUpdate = await this.bloggerRepository.changeBlogger(command.id, command.name, command.websiteUrl, command.description)
    //     if (afterUpdate == true) {
    //         return "update";
    //     }
    //     else {
    //         return "404"
    //     }
    // }
}


