import { Controller, Get, HttpException, HttpStatus, Param, Query, Req, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtFakeAuthGuard } from "src/guards/jwt-fake-auth.guard";
import { JwtServiceClass } from "src/guards/jwt.service";
import { GetAllPostsSpecificBlogCommand } from "src/superAdmin/SAblog/application/use-cases/get_all_posts_specific_blog";
import { constructorPagination } from "src/utils/pagination.constructor";
import { GetAllBlogsCommand } from "./application/use-cases/get_all_blogs";
import { GetTargetBlogCommand } from "./application/use-cases/get_target_blog";

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