"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comments = void 0;
class Comments {
    constructor(id, content, commentatorInfo, createdAt, postId, likesInfo, likeStorage, dislikeStorage) {
        this.id = id;
        this.content = content;
        this.commentatorInfo = commentatorInfo;
        this.createdAt = createdAt;
        this.postId = postId;
        this.likesInfo = likesInfo;
        this.likeStorage = likeStorage;
        this.dislikeStorage = dislikeStorage;
    }
}
exports.Comments = Comments;
//# sourceMappingURL=CommentsClass.js.map