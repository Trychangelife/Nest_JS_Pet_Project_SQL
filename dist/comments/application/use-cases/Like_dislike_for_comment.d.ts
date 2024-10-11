import { CommentsRepository } from "src/comments/repositories/comments.repository";
import { LikesDTO } from "src/utils/class-validator.form";
export declare class LikeDislikeCommentCommand {
    commmentId: string;
    likeStatus: LikesDTO;
    userId: string;
    login: string;
    constructor(commmentId: string, likeStatus: LikesDTO, userId: string, login: string);
}
export declare class LikeDislikeCommentUseCase {
    protected commentsRepository: CommentsRepository;
    constructor(commentsRepository: CommentsRepository);
    execute(command: LikeDislikeCommentCommand): Promise<string | object>;
}
