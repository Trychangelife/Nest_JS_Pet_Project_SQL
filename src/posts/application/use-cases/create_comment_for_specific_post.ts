import { CommandHandler } from "@nestjs/cqrs"
import { LIKES } from "src/utils/types"
import { Comments } from "src/comments/dto/CommentsClass"
import { CommentsType, CommentsTypeView } from "src/comments/dto/CommentsType"
import { v4 as uuidv4 } from "uuid"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"

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
    constructor(protected postsRepository: PostsRepositorySql) { }

    async execute(command: CreateCommentForSpecificPostCommand): Promise<CommentsTypeView | boolean> {
        const foundPost = await this.postsRepository.targetPost(command.postId)
        if (foundPost) {
            // CREATE ON CLASS
            const createdComment = new Comments(uuidv4(), command.content, { userId: command.userId, userLogin: command.userLogin }, (new Date()).toISOString(), command.postId, { likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE })
            return await this.postsRepository.createCommentForSpecificPost(createdComment)
        }
        else {
            return false
        }
    }
}

