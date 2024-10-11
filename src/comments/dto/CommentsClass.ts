import { LIKES } from "../../utils/types";


export class Comments {
    constructor(
        public id: string,
        public content: string,
        public commentatorInfo: {
            userId: string;
            userLogin: string;
        },
        public createdAt: string,
        public postId: string,
        public likesInfo: {
            likesCount: number;
            dislikesCount: number;
            myStatus: LIKES;
        },
        public likeStorage?: [{
            addedAt: Date;
            userId: string;
            login: string;
        }],
        public dislikeStorage?: [{
            addedAt: Date;
            userId: string;
            login: string;
        }]) {
    }
}
