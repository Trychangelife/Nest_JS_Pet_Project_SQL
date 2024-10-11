"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostClass = void 0;
class PostClass {
    constructor(id, title, shortDescription, content, blogId, blogName, createdAt, authorUserId, extendedLikesInfo, likeStorage, dislikeStorage) {
        this.id = id;
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
        this.blogName = blogName;
        this.createdAt = createdAt;
        this.authorUserId = authorUserId;
        this.extendedLikesInfo = extendedLikesInfo;
        this.likeStorage = likeStorage;
        this.dislikeStorage = dislikeStorage;
    }
}
exports.PostClass = PostClass;
//# sourceMappingURL=PostClass.js.map