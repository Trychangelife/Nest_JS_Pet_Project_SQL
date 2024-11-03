import { Module } from "@nestjs/common";
import { BlogsSuperAdminRepository } from "./repositories/blogs.SA.repository";
import { SuperAdminBlogsController } from "./sa.blog.controller";
import { BindingBlogSuperAdminUseCase } from "./application/use-cases/binding_blog";
import { GetAllBlogsSuperAdminUseCase } from "./application/use-cases/get_all_blogs";
import { CqrsModule } from "@nestjs/cqrs";


const useCasesSuperAdminBlogs = [GetAllBlogsSuperAdminUseCase, BindingBlogSuperAdminUseCase]

@Module({
    imports: [CqrsModule],
    controllers: [SuperAdminBlogsController],
    providers: [ BlogsSuperAdminRepository, ...useCasesSuperAdminBlogs],
    exports: [BlogsSuperAdminRepository]
  })
  export class BlogsSuperAdminModule {}