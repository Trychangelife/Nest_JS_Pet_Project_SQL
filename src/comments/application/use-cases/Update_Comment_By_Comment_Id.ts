import { CommandHandler } from "@nestjs/cqrs"
import { CommentsRepository } from "src/comments/repositories/comments.repository"


export class UpdateCommentCommand {
    constructor(
        public commentId: string, 
        public content: string, 
        public userId: string) {
        
    }
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase {
    constructor (protected commentsRepository: CommentsRepository ) {}

    async execute(command: UpdateCommentCommand): Promise<boolean | null> {
        return await this.commentsRepository.updateCommentByCommentId(command.commentId, command.content, command.userId)
    }
}


