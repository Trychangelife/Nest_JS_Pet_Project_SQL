import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtServiceClass } from "../guards/jwt.service";
import { PostsService } from "../posts/application/posts.service";
import { BlogsService } from "./application/blogs.service";
import { BasicAuthGuard } from "../guards/basic_auth_guard";
import { constructorPagination } from "../utils/pagination.constructor";
import { PostsType } from "src/posts/dto/PostsType";
import { BlogsType } from "src/blogs/dto/BlogsType";
import { PostTypeValidator } from "src/posts/dto/PostTypeValidator";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetAllBlogsCommand } from "./application/use-cases/get_all_blogs";
import { GetTargetBlogCommand } from "./application/use-cases/get_target_blog";
import { CreateBlogCommand } from "./application/use-cases/create_blog";
import { UpdateBlogCommand } from "./application/use-cases/update_blog";
import { DeleteBlogCommand } from "./application/use-cases/delete_single_blog";
import { Blogs } from "src/blogs/dto/Blog_validator_type";
import { GetAllPostsSpecificBlogCommand } from "src/posts/application/use-cases/get_all_posts_specific_blog";
import { CreatePostCommand } from "src/posts/application/use-cases/create_post";

@Controller('blogs')
export class BlogsController {
    
    constructor(
      //protected blogsService: BlogsService, 
      //protected postsService: PostsService,
      protected jwtServiceClass: JwtServiceClass,
      private commandBus: CommandBus,
      //private queryBus: QueryBus,
    ) {
    }

    @Get()
    async getAllBloggers(@Query() query: {searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}) {
      const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;
      const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
      const full: object = await this.commandBus.execute(new GetAllBlogsCommand(paginationData.pageSize, paginationData.pageNumber, searchNameTerm, paginationData.sortBy, paginationData.sortDirection));
      return full
    }

    @Get(':id')
    async getBloggerById(@Param('id') id: string) {
      const findBlogger: object | undefined = await this.commandBus.execute(new GetTargetBlogCommand(id))
        if (findBlogger !== undefined) {
            return findBlogger
        }
        else {
            throw new HttpException('Blog not found',HttpStatus.NOT_FOUND)
        }
    }

    @Get(':bloggerId/posts')
    async getPostByBloggerID(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string, sortBy: string, sortDirection: string}, @Param() params, @Req() req) {
      try {
        const token = req.headers.authorization.split(' ')[1]
        const userId = await this.jwtServiceClass.getUserByAccessToken(token)
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string, query.sortBy as string, query.sortDirection as string);
        const findBlogger: object | undefined = await this.commandBus.execute(new GetAllPostsSpecificBlogCommand(params.bloggerId, paginationData.pageNumber, paginationData.pageSize, userId));
       if (findBlogger !== undefined) {
        return findBlogger
      }
        else {
        throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
      }
      } catch (error) {
        const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string, query.sortBy as string, query.sortDirection as string);
      const findBlogger: object | undefined = await this.commandBus.execute(new GetAllPostsSpecificBlogCommand(params.bloggerId, paginationData.pageNumber, paginationData.pageSize));
      
      if (findBlogger !== undefined) {
        return findBlogger
      }
      else {
        throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
      }
      }
      
    }
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Post()
    async createBlogger(@Body() blogsType: Blogs) {
  
      const createrPerson: BlogsType | null = await this.commandBus.execute(new CreateBlogCommand(blogsType.name, blogsType.websiteUrl, blogsType.description ));
      if (createrPerson !== null) {
        return createrPerson
      }
      else { 
        throw new HttpException('Opps check input Data',HttpStatus.BAD_REQUEST)
      }
    }
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Post(':id/posts')
    async createPostByBloggerId(@Param() params, @Body() post: PostTypeValidator) {
      const blogger = await this.commandBus.execute(new GetTargetBlogCommand(params.id))
      if (blogger == undefined || blogger == null) { throw new HttpException('Blogger NOT FOUND',HttpStatus.NOT_FOUND) }
  
      const createPostForSpecificBlogger: string | object | null = await this.commandBus.execute(new CreatePostCommand(post.title, post.content, post.shortDescription, post.blogId, params.id));
      return createPostForSpecificBlogger;
  
    }
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':id')
    async updateBlogger(@Param() params, @Body() blogsType: Blogs) {
      const alreadyChanges: string = await this.commandBus.execute(new UpdateBlogCommand(params.id, blogsType.name, blogsType.websiteUrl, blogsType.description));
      console.log(params.id, blogsType.name, blogsType.websiteUrl)
      if (alreadyChanges === 'update') {
        throw new HttpException('Update succefully', HttpStatus.NO_CONTENT)
      }
      else if (alreadyChanges === "404") {
        throw new HttpException('Blogger NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }
    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    async deleteOneBlogger(@Param() params) {
      const afterDelete = await this.commandBus.execute(new DeleteBlogCommand(params.id));
      if (afterDelete === "204") {
        throw new HttpException('Delete succefully',HttpStatus.NO_CONTENT)
      }
      else {
        throw new HttpException('Blogger NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }
  }