import { CommentsRepository } from "src/comments/repositories/comments.repository";
export declare class DeleteCommentCommand {
    commentId: string;
    userId?: string;
    constructor(commentId: string, userId?: string);
}
export declare class DeleteCommentUseCase {
    protected commentsRepository: CommentsRepository;
    constructor(commentsRepository: CommentsRepository);
    execute(command: DeleteCommentCommand): Promise<boolean | null>;
}
