import { CommandHandler } from "@nestjs/cqrs"
import { CommentsRepository } from "src/comments/repositories/comments.repository"
import { CommentsType } from "src/comments/dto/CommentsType"


export class GetCommentCommand {
    constructor(
        public id: string, 
        public userId?: string) {
        
    }
}

@CommandHandler(GetCommentCommand)
export class GetCommentUseCase {
    constructor (protected commentsRepository: CommentsRepository ) {}

    async execute(command: GetCommentCommand): Promise<CommentsType | null> {
        return await this.commentsRepository.commentsByUserId(command.id, command.userId)
    }
}


