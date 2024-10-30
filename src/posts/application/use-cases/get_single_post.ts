import { Get } from "@nestjs/common"
import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"


export class GetSinglePostCommand {
    constructor(
        public postId: string, 
        public userId?: string,
        public description?: string) {
        
    }
}

@CommandHandler(GetSinglePostCommand)
export class GetSinglePostUseCase {
    constructor (protected postsRepository: PostsRepositorySql ) {}

    // async execute(command: GetSinglePostCommand): Promise<object | undefined> {
    //     return await this.postsRepository.targetPosts(command.postId, command.userId, command.description)
    // }
}

