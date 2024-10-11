import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"
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
    constructor(protected postsRepository: PostRepository) { }

    async execute(command: LikeDislikeForPostCommand): Promise<string | object> {
        return await this.postsRepository.like_dislike(command.postId, command.likeStatus, command.userId, command.login)
    }
}

