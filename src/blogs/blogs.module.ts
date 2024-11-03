import { Module, forwardRef } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersModule } from "src/users/users.module";
import { BlogsService } from "./application/blogs.service";
import { BlogsController } from "./blogs.controller";
import { BlogsRepositorySql } from "./repositories/blogs.sql.repository";
import { CreateBlogUseCase } from "src/superAdmin/SAblog/application/use-cases/create_blog";
import { DeleteBlogUseCase } from "src/superAdmin/SAblog/application/use-cases/delete_single_blog";
import { UpdateBlogUseCase } from "src/superAdmin/SAblog/application/use-cases/update_blog";
import { GetAllBlogsUseCase, GetAllBlogsCommand } from "./application/use-cases/get_all_blogs";
import { GetTargetBlogUseCase } from "./application/use-cases/get_target_blog";


const useCasesBlogs = [GetAllBlogsUseCase, GetTargetBlogUseCase, CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase, GetAllBlogsCommand]

@Module({
    imports: [forwardRef(() => UsersModule), CqrsModule],
    controllers: [BlogsController],
    providers: [ BlogsService,BlogsRepositorySql, ...useCasesBlogs],
    exports: [BlogsService,BlogsRepositorySql,]
  })
  export class BlogsModule {}