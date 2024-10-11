import { CommentsRepository } from "src/comments/repositories/comments.repository";
import { CommentsType } from "src/comments/dto/CommentsType";
export declare class GetCommentCommand {
    id: string;
    userId?: string;
    constructor(id: string, userId?: string);
}
export declare class GetCommentUseCase {
    protected commentsRepository: CommentsRepository;
    constructor(commentsRepository: CommentsRepository);
    execute(command: GetCommentCommand): Promise<CommentsType | null>;
}
