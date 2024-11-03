import { Module } from "@nestjs/common";
import { BlogsModule } from "src/blogs/blogs.module";
import { UsersModule } from "src/users/users.module";
import { PostsService } from "./application/posts.service";
import { PostController } from "./posts.controller";
import { PostsRepositorySql } from "./repositories/posts.sql.repository";
import { GetAllPostsSpecificBlogUseCase } from "src/superAdmin/SAblog/application/use-cases/get_all_posts_specific_blog";
import { CreateCommentForSpecificPostUseCase } from "./application/use-cases/create_comment_for_specific_post";
import { CreatePostUseCase } from "./application/use-cases/create_post";
import { DeletePostUseCase } from "./application/use-cases/delete_post";
import { GetAllPostsUseCase } from "./application/use-cases/get_all_posts";
import { GetCommentByPostIdUseCase } from "./application/use-cases/get_comments_by_postID";
import { GetSinglePostUseCase } from "./application/use-cases/get_single_post";
import { LikeDislikeForPostUseCase } from "./application/use-cases/like_dislike_for_post";
import { UpdatePostUseCase } from "./application/use-cases/update_post";
import { CqrsModule } from "@nestjs/cqrs";

const useCasesPosts = [GetAllPostsUseCase, GetSinglePostUseCase, GetAllPostsSpecificBlogUseCase, CreatePostUseCase, UpdatePostUseCase, DeletePostUseCase, CreateCommentForSpecificPostUseCase, GetCommentByPostIdUseCase, LikeDislikeForPostUseCase]


@Module({
    imports: [BlogsModule, UsersModule, CqrsModule],
    controllers: [PostController],
    providers: [ PostsService, PostsRepositorySql, ...useCasesPosts],
    exports: [PostsService, PostsRepositorySql]
  })
  export class PostsModule {}