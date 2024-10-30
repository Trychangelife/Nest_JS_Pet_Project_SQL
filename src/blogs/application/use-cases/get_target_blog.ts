import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepositorySql } from "src/blogs/repositories/blogs.sql.repository"


export class GetTargetBlogCommand {
    constructor(
        public blogId: string,
        public userId?: string) {
        
    }
}

@CommandHandler(GetTargetBlogCommand)
export class GetTargetBlogUseCase {
    constructor (protected bloggerRepository: BlogsRepositorySql ) {}


    async execute(command: GetTargetBlogCommand): Promise<object | undefined> {

        return this.bloggerRepository.targetBlog(command.blogId, command.userId)
    }
}


