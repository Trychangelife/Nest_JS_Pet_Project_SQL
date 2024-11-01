import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { Model } from "mongoose";
import { JwtServiceClass } from "src/guards/jwt.service";
import { PostsService } from "src/posts/application/posts.service";
import { BlogsService } from "./application/blogs.service";
import { BasicAuthGuard } from "src/guards/basic_auth_guard";
import { constructorPagination } from "src/utils/pagination.constructor";
import { PostsType } from "src/posts/dto/PostsType";
import { BlogsType, BlogsTypeView } from "src/blogs/dto/BlogsType";
import { PostTypeValidator } from "src/posts/dto/PostTypeValidator";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetAllBlogsCommand } from "./application/use-cases/get_all_blogs";
import { GetTargetBlogCommand } from "./application/use-cases/get_target_blog";
import { CreateBlogCommand } from "../superAdmin/SAblog/application/use-cases/create_blog";
import { UpdateBlogCommand } from "../superAdmin/SAblog/application/use-cases/update_blog";
import { DeleteBlogCommand } from "../superAdmin/SAblog/application/use-cases/delete_single_blog";
import { Blogs } from "src/blogs/dto/Blog_validator_type";
import { GetAllPostsSpecificBlogCommand } from "src/superAdmin/SAblog/application/use-cases/get_all_posts_specific_blog";
import { CreatePostCommand } from "src/posts/application/use-cases/create_post";
import { JwtFakeAuthGuard } from "src/guards/jwt-fake-auth.guard";

@Controller('blogs')
export class BlogsController {

  constructor(
    protected jwtServiceClass: JwtServiceClass,
    private commandBus: CommandBus,
  ) {
  }

  @Get()
  async getAllBloggers(@Query() query: { searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string }) {
    const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;
    const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
    const full: object = await this.commandBus.execute(new GetAllBlogsCommand(paginationData.pageSize, paginationData.pageNumber, searchNameTerm, paginationData.sortBy, paginationData.sortDirection));
    return full
  }

  @Get(':id')
  async getBloggerById(@Param('id') id: string) {
    const findBlogger: object | undefined = await this.commandBus.execute(new GetTargetBlogCommand(id))
    if (findBlogger) {
      return findBlogger
    }
    else {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
    }
  }

  // Return posts for blog with paging and sorting
  @UseGuards(JwtFakeAuthGuard)
  @Get(':blogId/posts')
  async getAllPostByBlogId(@Param() params, @Query() query: { pageNumber: string, pageSize: string, sortBy: string, sortDirection: string },  @Req() req) {
    const userId = req?.user?.id ?? null;
    const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
    const full: object = await this.commandBus.execute(new GetAllPostsSpecificBlogCommand(params.blogId, paginationData.pageNumber, paginationData.pageSize, paginationData.sortBy, paginationData.sortDirection, userId));
    return full
  }

  // @Get(':blogId/posts')
  // async getPostByBloggerID(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string, sortBy: string, sortDirection: string}, @Param() params, @Req() req) {
  //   try {
  //     const token = req.headers.authorization.split(' ')[1]
  //     const userId = await this.jwtServiceClass.getUserByAccessToken(token)
  //     const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string, query.sortBy as string, query.sortDirection as string);
  //     const findBlogger: object | undefined = await this.commandBus.execute(new GetAllPostsSpecificBlogCommand(params.blogId, paginationData.pageNumber, paginationData.pageSize, userId));
  //    if (findBlogger !== undefined) {
  //     return findBlogger
  //   }
  //     else {
  //     throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
  //   }
  //   } catch (error) {
  //     const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string, query.sortBy as string, query.sortDirection as string);
  //   const findBlogger: object | undefined = await this.commandBus.execute(new GetAllPostsSpecificBlogCommand(params.bloggerId, paginationData.pageNumber, paginationData.pageSize));

  //   if (findBlogger !== undefined) {
  //     return findBlogger
  //   }
  //   else {
  //     throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
  //   }
  //   }

  // }
}