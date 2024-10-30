import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepositorySql } from "src/blogs/repositories/blogs.sql.repository"
import { PostRepository } from "src/posts/repositories/posts.repository"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"


export class GetAllPostsSpecificBlogCommand {
    constructor(
        public blogId: string, 
        public page?: number, 
        public pageSize?: number,
        public sortBy?: string,
        public sortDirection?: string
        ) {
        
    }
}

@CommandHandler(GetAllPostsSpecificBlogCommand)
export class GetAllPostsSpecificBlogUseCase {
    constructor (protected postsRepository: BlogsRepositorySql ) {}

    async execute(command: GetAllPostsSpecificBlogCommand): Promise<object | undefined> {
        console.log("service:", command.blogId)
        let skip = 0
        if (command.page && command.pageSize) {
            skip = (command.page - 1) * command.pageSize
        }

        return await this.postsRepository.allPostsSpecificBlogger(command.blogId, skip, command.pageSize, command.page, command.sortBy, command.sortDirection)
    }
}

