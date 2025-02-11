import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { CommentsController } from "./comments.controller";
import { CommentsRepository } from "./repositories/comments.repository";
import { CommentsService } from "./application/comments.service";
import { GetCommentUseCase } from "./application/use-cases/Get_comment_by_id";
import { DeleteCommentUseCase } from "./application/use-cases/Delete_comment_by_id";
import { UpdateCommentUseCase } from "./application/use-cases/Update_Comment_By_Comment_Id";
import { LikeDislikeCommentUseCase } from "./application/use-cases/Like_dislike_for_comment";
import { LikeDislikeForPostUseCase } from "src/posts/application/use-cases/like_dislike_for_post";
import { CqrsModule } from "@nestjs/cqrs";
import { PostsModule } from "src/posts/posts.module";

const useCasesComments = [GetCommentUseCase, DeleteCommentUseCase, UpdateCommentUseCase, LikeDislikeForPostUseCase, LikeDislikeCommentUseCase]

@Module({
    imports: [UsersModule, CqrsModule, PostsModule],
    controllers: [CommentsController],
    providers: [CommentsRepository, CommentsService, ...useCasesComments],
    exports: []
  })
  export class CommentsModule {}