import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"


export class GetAllPostsCommand {
    constructor(public pageSize: number, public pageNumber: number, public userId?: string) {
        
    }
}

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsUseCase {
    constructor (protected postsRepository: PostRepository ) {}

    async execute(command: GetAllPostsCommand): Promise<object> {
        let skip = 0
        if (command.pageNumber && command.pageSize) {
            skip = (command.pageNumber - 1) * command.pageSize
        }
        return this.postsRepository.allPosts(skip, command.pageSize, command.pageNumber, command.userId)
    }
}

