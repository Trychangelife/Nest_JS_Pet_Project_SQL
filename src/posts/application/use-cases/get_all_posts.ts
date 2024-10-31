import { CommandHandler } from "@nestjs/cqrs"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"


export class GetAllPostsCommand {
    constructor(
        public limit: number, 
        public pageNumber: number,
        public sortBy: string,
        public sortDirection: string,
        public userId?: number) {
        
    }
}

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsUseCase {
    constructor (protected postsRepository: PostsRepositorySql ) {}

    async execute(command: GetAllPostsCommand): Promise<object> {
        let offset = 0
        if (command.pageNumber && command.limit) {
            offset = (command.pageNumber - 1) * command.limit
        }
        return this.postsRepository.allPosts(offset, command.limit, command.pageNumber, command.sortBy, command.sortDirection, command.userId)
    }
}

