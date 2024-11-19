import { CommandHandler } from "@nestjs/cqrs"
import { BlogsType, BlogsTypeView } from "src/blogs/dto/BlogsType"
import { BlogsClass } from "src/blogs/dto/BlogsClass"
import { BlogsRepositorySql } from "src/blogs/repositories/blogs.sql.repository"


export class CreateBlogCommand {
    constructor(public name: string, public websiteUrl: string, public description: string) {
        
    }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase {
    constructor (protected bloggerRepository: BlogsRepositorySql ) {}

    async execute(command: CreateBlogCommand): Promise<BlogsTypeView | null> {
        // Построено на классе
        const newBlogs = new BlogsClass(1, command.name, command.description, command.websiteUrl, (new Date()), false, null, null)
        const createdBlogs = await this.bloggerRepository.createBlogger(newBlogs)
        return createdBlogs
    }
}


