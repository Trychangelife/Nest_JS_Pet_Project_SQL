import { CommandHandler } from "@nestjs/cqrs"
import { CommentsRepository } from "src/comments/repositories/comments.repository"


export class DeleteCommentCommand {
    constructor(
        public commentId: string, 
        public userId?: string) {
        
    }
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase {
    constructor (protected commentsRepository: CommentsRepository ) {}

    async execute(command: DeleteCommentCommand): Promise<boolean | null> {
        return await this.commentsRepository.deleteCommentByCommentId(command.commentId, command.userId)
    }
}


