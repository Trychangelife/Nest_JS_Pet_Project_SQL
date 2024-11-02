import { Module } from "@nestjs/common";
import { SuperAdminBlogsController } from "./sa.blog.controller";
import { GetAllBlogsSuperAdminUseCase } from "./application/use-cases/get_all_blogs";
import { BindingBlogSuperAdminUseCase } from "./application/use-cases/binding_blog";
import { BlogsSuperAdminRepository } from "./repositories/blogs.SA.repository";


const useCasesSuperAdminBlogs = [GetAllBlogsSuperAdminUseCase, BindingBlogSuperAdminUseCase]

@Module({
    imports: [],
    controllers: [SuperAdminBlogsController],
    providers: [...useCasesSuperAdminBlogs, BlogsSuperAdminRepository],
    exports: [BlogsSuperAdminRepository]
  })
  export class BlogsSuperAdminModule {}