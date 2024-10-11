import { Model } from "mongoose";
import { LIKES } from "src/utils/types";
import { UsersType } from "src/users/dto/UsersType";
import { CommentsType } from "src/comments/dto/CommentsType";
import { PostsType } from "src/posts/dto/PostsType";
import { BlogsType } from "src/blogs/dto/BlogsType";
export declare const postViewModel: {
    _id: number;
    id: number;
    title: number;
    shortDescription: number;
    content: number;
    blogId: number;
    blogName: number;
    createdAt: number;
    extendedLikesInfo: number;
};
export declare const commentsVievModel: {
    _id: number;
    id: number;
    content: number;
    commentatorInfo: {
        userId: number;
        userLogin: number;
    };
    createdAt: number;
    likesInfo: number;
};
export declare class PostRepository {
    protected postsModel: Model<PostsType>;
    protected bloggerModel: Model<BlogsType>;
    protected commentsModel: Model<CommentsType>;
    protected usersModel: Model<UsersType>;
    constructor(postsModel: Model<PostsType>, bloggerModel: Model<BlogsType>, commentsModel: Model<CommentsType>, usersModel: Model<UsersType>);
    allPosts(skip: number, limit: number, page?: number, userId?: string): Promise<object>;
    targetPosts(postId: string, userId?: string, description?: string): Promise<PostsType | undefined>;
    allPostsSpecificBlogger(blogId: string, skip: number, pageSize?: number, page?: number, userId?: string): Promise<object | undefined>;
    releasePost(newPosts: PostsType, blogId: string, bloggerIdUrl?: string): Promise<object | string>;
    changePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<string | object>;
    deletePost(postId: string, blogId?: string): Promise<boolean>;
    createCommentForSpecificPost(createdComment: CommentsType): Promise<CommentsType | boolean>;
    takeCommentByIdPost(postId: string, skip: number, limit: number, page: number, userId?: string, sortBy?: string, sortDirection?: string): Promise<object | boolean>;
    like_dislike(postId: string, likeStatus: LIKES, userId: string, login: string): Promise<string | object>;
}
