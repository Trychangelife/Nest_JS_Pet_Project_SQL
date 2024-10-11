import { CommandHandler } from "@nestjs/cqrs"
import { BlogsType } from "src/blogs/dto/BlogsType"
import { BlogsRepository } from "src/blogs/repositories/blogs.repository"
import { BlogsClass } from "src/blogs/dto/BlogsClass"
import { v4 as uuidv4 } from "uuid"


export class CreateBlogCommand {
    constructor(public name: string, public websiteUrl: string, public description: string) {
        
    }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase {
    constructor (protected bloggerRepository: BlogsRepository ) {}

    async execute(command: CreateBlogCommand): Promise<BlogsType | null> {
        // Построено на классе
        const newBlogs = new BlogsClass(uuidv4(), command.name, command.description, command.websiteUrl, (new Date()).toISOString(), false, {userId: null, userLogin: null})
        const createdBlogs = await this.bloggerRepository.createBlogger(newBlogs)
        return createdBlogs
    }
}


