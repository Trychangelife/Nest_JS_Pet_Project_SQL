import { CommandHandler } from "@nestjs/cqrs"
import { CommentsRepository } from "src/comments/repositories/comments.repository"
import { LikesDTO } from "src/utils/class-validator.form"


export class LikeDislikeCommentCommand {
    constructor(
        public commmentId: string, 
        public likeStatus: LikesDTO, 
        public userId: string, 
        public login: string) {
        
    }
}

@CommandHandler(LikeDislikeCommentCommand)
export class LikeDislikeCommentUseCase {
    constructor (protected commentsRepository: CommentsRepository ) {}

    async execute(command: LikeDislikeCommentCommand): Promise<string | object> {
        return await this.commentsRepository.like_dislike(command.commmentId, command.likeStatus, command.userId, command.login)
    }
}


