import { JwtServiceClass } from "../guards/jwt.service";
import { CommentsService } from "./application/comments.service";
import { LikesDTO } from "../utils/class-validator.form";
import { Comment } from "src/comments/dto/Comment_validator_type";
import { CommandBus } from "@nestjs/cqrs";
export declare class CommentsController {
    protected commentsService: CommentsService;
    protected jwtServiceClass: JwtServiceClass;
    private commandBus;
    constructor(commentsService: CommentsService, jwtServiceClass: JwtServiceClass, commandBus: CommandBus);
    getCommentById(params: any, req: any): Promise<any>;
    updateCommentByCommentId(params: any, content: Comment, req: any, res: any): Promise<void>;
    deleteCommentById(params: any, req: any, res: any): Promise<void>;
    like_dislike(params: any, likeStatus: LikesDTO, req: any, res: any): Promise<void>;
}
