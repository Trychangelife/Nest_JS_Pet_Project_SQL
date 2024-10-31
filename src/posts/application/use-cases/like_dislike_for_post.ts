import { CommandHandler } from "@nestjs/cqrs"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"
import { LIKES } from "src/utils/types"

export class LikeDislikeForPostCommand {
    constructor(
        public postId: string, 
        public likeStatus: LIKES, 
        public userId: string, 
        public login: string) {

    }
}

@CommandHandler(LikeDislikeForPostCommand)
export class LikeDislikeForPostUseCase {
    constructor(protected postsRepository: PostsRepositorySql) { }

    async execute(command: LikeDislikeForPostCommand): Promise<string | object> {
        return await this.postsRepository.like_Dislike(command.postId, command.likeStatus, command.userId, command.login)
    }
}

