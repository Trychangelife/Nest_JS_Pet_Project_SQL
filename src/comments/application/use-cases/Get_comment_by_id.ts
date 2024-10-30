import { CommandHandler } from "@nestjs/cqrs"
import { CommentsRepository } from "src/comments/repositories/comments.repository"
import { CommentsType, CommentsTypeView } from "src/comments/dto/CommentsType"


export class GetCommentCommand {
    constructor(
        public id: string, 
        public userId?: string) {
        
    }
}

@CommandHandler(GetCommentCommand)
export class GetCommentUseCase {
    constructor (protected commentsRepository: CommentsRepository ) {}

    async execute(command: GetCommentCommand): Promise<CommentsTypeView | null> {
        return await this.commentsRepository.commentsById(command.id, command.userId)
    }
}


