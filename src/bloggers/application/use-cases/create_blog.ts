import { CommandHandler } from "@nestjs/cqrs"
import { v4 as uuidv4 } from "uuid"
import { BloggersType } from "src/bloggers/dto/Bloggers.Blogs.Type"
import { BloggersClass } from "src/bloggers/dto/Bloggers.Blogs.Class"
import { BlogsByBloggerRepository } from "src/bloggers/repositories/bloggers.repository"
import { BlogsRepositorySql } from "src/blogs/repositories/blogs.sql.repository"


export class CreateBlogByBloggerCommand {
    constructor(
        public name: string, 
        public websiteUrl: string, 
        public description: string,
        public userId: number,
        public userLogin: string) {
        
    }
}

@CommandHandler(CreateBlogByBloggerCommand)
export class CreateBlogByBloggerUseCase {
    constructor (protected bloggerRepository: BlogsRepositorySql ) {}

    // async execute(command: CreateBlogByBloggerCommand): Promise<BloggersType | null> {
    //     // Построено на классе
    //     const newBlogs = new BloggersClass(1, command.name, command.description, command.websiteUrl, (new Date()).toISOString(), false, command.userId, command.userLogin)
    //     const createdBlogs = await this.bloggerRepository.createBlogger(newBlogs)
    //     return createdBlogs
    // }
}


