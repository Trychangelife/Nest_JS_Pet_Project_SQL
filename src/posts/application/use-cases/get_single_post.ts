import { Get } from "@nestjs/common"
import { CommandHandler } from "@nestjs/cqrs"
import { PostsTypeView } from "src/posts/dto/PostsType"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"


export class GetSinglePostCommand {
    constructor(
        public postId: string, 
        public userId?: number,
        public description?: string) {
        
    }
}

@CommandHandler(GetSinglePostCommand)
export class GetSinglePostUseCase {
    constructor (protected postsRepository: PostsRepositorySql ) {}

    async execute(command: GetSinglePostCommand): Promise<PostsTypeView | null> {
        return await this.postsRepository.targetPost(command.postId, command.userId)
    }
}

