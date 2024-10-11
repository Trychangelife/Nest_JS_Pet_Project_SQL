import { PostsType } from "src/posts/dto/PostsType";
import { DataSource } from "typeorm";
export declare const postViewModel: {
    _id: number;
    id: number;
    title: number;
    shortDescription: number;
    content: number;
    bloggerId: number;
    bloggerName: number;
    addedAt: number;
    extendedLikesInfo: number;
};
export declare const commentsVievModel: {
    _id: number;
    postId: number;
    __v: number;
    likeStorage: number;
    dislikeStorage: number;
};
export declare class PostsRepositorySql {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    allPosts(skip: number, limit: number, page?: number, userId?: string): Promise<object>;
    releasePost(newPosts: PostsType, blogId: string, bloggerIdUrl?: string): Promise<object | string>;
}
