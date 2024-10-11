import { LIKES } from "../../utils/types";


export class PostClass {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public authorUserId: string,
        public extendedLikesInfo: {
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
        }]
    ) {
    }
}
