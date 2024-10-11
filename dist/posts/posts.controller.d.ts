import { JwtServiceClass } from "../guards/jwt.service";
import { LIKES } from "../utils/types";
import { PostsService } from "./application/posts.service";
import { Comment } from "src/comments/dto/Comment_validator_type";
import { PostTypeValidatorForCreate } from "src/posts/dto/PostTypeValidator";
import { CommandBus } from "@nestjs/cqrs";
import { PostsType } from "./dto/PostsType";
export declare class PostController {
    protected postsService: PostsService;
    protected jwtServiceClass: JwtServiceClass;
    private commandBus;
    constructor(postsService: PostsService, jwtServiceClass: JwtServiceClass, commandBus: CommandBus);
    getAllPosts(query: {
        searchNameTerm: string;
        pageNumber: string;
        pageSize: string;
        sortBy: string;
        sortDirection: string;
    }, req: any): Promise<object>;
    getPostByID(params: any, req: any): Promise<PostsType>;
    createPost(post: PostTypeValidatorForCreate, res: any): Promise<void>;
    updatePost(params: any, post: PostTypeValidatorForCreate, req: any): Promise<void>;
    deletePostById(params: any, res: any): Promise<void>;
    createCommentForPost(postId: string, content: Comment, req: any): Promise<any>;
    getCommentsByPostId(query: {
        searchNameTerm: string;
        pageNumber: string;
        pageSize: string;
        sortBy: string;
        sortDirection: string;
    }, params: any, req: any): Promise<any>;
    like_dislike(postId: string, likeStatus: LIKES, req: any): Promise<void>;
}
