import { Module } from "@nestjs/common";
import { CreateBlogUseCase } from "src/superAdmin/SAblog/application/use-cases/create_blog";
import { DeleteBlogUseCase } from "src/superAdmin/SAblog/application/use-cases/delete_single_blog";
import { UpdateBlogUseCase } from "src/superAdmin/SAblog/application/use-cases/update_blog";
import { BlogsService } from "./application/blogs.service";
import { GetAllBlogsUseCase } from "./application/use-cases/get_all_blogs";
import { GetTargetBlogUseCase } from "./application/use-cases/get_target_blog";
import { BlogsController } from "./blogs.controller";
import { BlogsRepositorySql } from "./repositories/blogs.sql.repository";
import { UsersModule } from "src/users/users.module";

const useCasesBlogs = [GetAllBlogsUseCase, GetTargetBlogUseCase, CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase]


@Module({
    imports: [UsersModule],
    controllers: [BlogsController],
    providers: [ BlogsService, ...useCasesBlogs, BlogsRepositorySql],
    exports: [BlogsService,BlogsRepositorySql,]
  })
  export class BlogsModule {}