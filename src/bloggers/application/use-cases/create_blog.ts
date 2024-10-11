import { CommandHandler } from "@nestjs/cqrs"
import { v4 as uuidv4 } from "uuid"
import { BloggersType } from "src/bloggers/dto/Bloggers.Blogs.Type"
import { BloggersClass } from "src/bloggers/dto/Bloggers.Blogs.Class"
import { BlogsByBloggerRepository } from "src/bloggers/repositories/bloggers.repository"


export class CreateBlogByBloggerCommand {
    constructor(
        public name: string, 
        public websiteUrl: string, 
        public description: string,
        public userId: string,
        public userLogin: string) {
        
    }
}

@CommandHandler(CreateBlogByBloggerCommand)
export class CreateBlogByBloggerUseCase {
    constructor (protected bloggerRepository: BlogsByBloggerRepository ) {}

    async execute(command: CreateBlogByBloggerCommand): Promise<BloggersType | null> {
        // Построено на классе
        const newBlogs = new BloggersClass(uuidv4(), command.name, command.description, command.websiteUrl, (new Date()).toISOString(), false, {userId: command.userId, userLogin: command.userLogin})
        const createdBlogs = await this.bloggerRepository.createBlogger(newBlogs)
        return createdBlogs
    }
}


