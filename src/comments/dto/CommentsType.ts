import { LIKES } from "../../utils/types";

export type CommentsType = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    postId: string;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LIKES;
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
