import { CommentsRepository } from "src/comments/repositories/comments.repository";
export declare class UpdateCommentCommand {
    commentId: string;
    content: string;
    userId: string;
    constructor(commentId: string, content: string, userId: string);
}
export declare class UpdateCommentUseCase {
    protected commentsRepository: CommentsRepository;
    constructor(commentsRepository: CommentsRepository);
    execute(command: UpdateCommentCommand): Promise<boolean | null>;
}
