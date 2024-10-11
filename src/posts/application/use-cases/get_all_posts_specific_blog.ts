import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"


export class GetAllPostsSpecificBlogCommand {
    constructor(
        public bloggerId: string, 
        public page?: number, 
        public pageSize?: number, 
        public userId?: string) {
        
    }
}

@CommandHandler(GetAllPostsSpecificBlogCommand)
export class GetAllPostsSpecificBlogUseCase {
    constructor (protected postsRepository: PostRepository ) {}

    async execute(command: GetAllPostsSpecificBlogCommand): Promise<object | undefined> {
        let skip = 0
        if (command.page && command.pageSize) {
            skip = (command.page - 1) * command.pageSize
        }

        return await this.postsRepository.allPostsSpecificBlogger(command.bloggerId, skip, command.pageSize, command.page, command.userId)
    }
}

