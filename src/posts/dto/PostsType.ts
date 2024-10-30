import internal from "stream";
import { LIKES } from "../../utils/types";


export type PostsType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    authorUserId: number;
    extendedLikesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LIKES;
        newestLikes?: [
            {
                addedAt: Date;
                userId: string;
                login: string;
            }
        ];
    };
    likeStorage?: [{
        addedAt: Date;
        userId: string;
        login: string;
    }];
    dislikeStorage?: [{
        addedAt: Date;
        userId: string;
        login: string;
    }];

};

export type PostsTypeView = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LIKES,
        newestLikes: []
    }
}
