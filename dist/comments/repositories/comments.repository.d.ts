import { Model } from "mongoose";
import { LikesDTO } from "src/utils/class-validator.form";
import { UsersType } from "src/users/dto/UsersType";
import { CommentsType } from "src/comments/dto/CommentsType";
export declare class CommentsRepository {
    protected commentsModel: Model<CommentsType>;
    protected usersModel: Model<UsersType>;
    constructor(commentsModel: Model<CommentsType>, usersModel: Model<UsersType>);
    commentsByUserId(commentId: string, userId?: string): Promise<CommentsType | null>;
    updateCommentByCommentId(commentId: string, content: string, userId: string): Promise<boolean | null>;
    deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null>;
    like_dislike(commentId: string, likeStatus: LikesDTO, userId: string, login: string): Promise<string | object>;
}
