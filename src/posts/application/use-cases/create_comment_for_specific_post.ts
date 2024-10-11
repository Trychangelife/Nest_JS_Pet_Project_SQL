import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"
import { LIKES } from "src/utils/types"
import { Comments } from "src/comments/dto/CommentsClass"
import { CommentsType } from "src/comments/dto/CommentsType"
import { v4 as uuidv4 } from "uuid"

export class CreateCommentForSpecificPostCommand {
    constructor(
        public postId: string,
        public content: string,
        public userId: string,
        public userLogin: string) {

    }
}

@CommandHandler(CreateCommentForSpecificPostCommand)
export class CreateCommentForSpecificPostUseCase {
    constructor(protected postsRepository: PostRepository) { }

    async execute(command: CreateCommentForSpecificPostCommand): Promise<CommentsType | boolean> {
        const foundPost = await this.postsRepository.targetPosts(command.postId)
        if (foundPost) {
            // CREATE ON CLASS
            const createdComment = new Comments(uuidv4(), command.content, { userId: command.userId, userLogin: command.userLogin }, (new Date()).toISOString(), command.postId, { likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE })
            return this.postsRepository.createCommentForSpecificPost(createdComment)
        }
        else {
            return false
        }
    }
}

