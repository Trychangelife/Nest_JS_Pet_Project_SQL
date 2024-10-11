import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtServiceClass } from "../guards/jwt.service";
import { PostsService } from "../posts/application/posts.service";
//import { BlogsService } from "./application/blogs.service";
import { BasicAuthGuard } from "../guards/basic_auth_guard";
import { constructorPagination } from "../utils/pagination.constructor";
import { PostsType } from "src/posts/dto/PostsType";
import { BlogsType } from "src/blogs/dto/BlogsType";
import { PostTypeValidator } from "src/posts/dto/PostTypeValidator";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateBlogByBloggerCommand } from "./application/use-cases/create_blog";
import { Blogs } from "src/blogs/dto/Blog_validator_type";
import { GetAllPostsSpecificBlogCommand } from "src/posts/application/use-cases/get_all_posts_specific_blog";
import { CreatePostCommand } from "src/posts/application/use-cases/create_post";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { GetUserByUserIdCommand } from "src/users/application/use-cases/Get_user_by_id";
import { BloggersType } from "./dto/Bloggers.Blogs.Type";
import { GetAllBlogsforBloggerCommand } from "./application/use-cases/get_all_blogs";
import { DeleteBlogForSpecificBloggerCommand } from "./application/use-cases/delete_single_blog";
import { GetTargetBlogCommand } from "src/blogs/application/use-cases/get_target_blog";
import { CreatePostByBloggerCommand, CreatePostByBloggerUseCase } from "./application/use-cases/create_Post";
import { UpdateBlogByBloggerCommand } from "./application/use-cases/update_blog";
import { DeletePostByBloggerCommand } from "./application/use-cases/delete_post_by_id";
import { GetSinglePostCommand } from "src/posts/application/use-cases/get_single_post";
import { CheckForbiddenCommand } from "src/posts/application/use-cases/check_forbidden";
import { UpdatePostCommand } from "src/posts/application/use-cases/update_post";

@Controller('blogger/blogs')
export class BloggersController {
    
    constructor(
      //protected blogsService: BlogsService, 
      //protected postsService: PostsService,
      protected jwtServiceClass: JwtServiceClass,
      private commandBus: CommandBus,
      //private queryBus: QueryBus,
    ) {
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllBloggers(@Query() query: {searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}, @Req() req) {
      const token = req.headers.authorization.split(' ')[1]
      const userId = await this.jwtServiceClass.getUserByAccessToken(token)
      const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;
      const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
      const full: object = await this.commandBus.execute(new GetAllBlogsforBloggerCommand(paginationData.pageSize, paginationData.pageNumber, searchNameTerm, paginationData.sortBy, paginationData.sortDirection, userId));
      return full
    }

    // @Get(':id')
    // async getBloggerById(@Param('id') id: string) {
    //   const findBlogger: object | undefined = await this.commandBus.execute(new GetTargetBlogCommand(id))
    //     if (findBlogger !== undefined) {
    //         return findBlogger
    //     }
    //     else {
    //         throw new HttpException('Blog not found',HttpStatus.NOT_FOUND)
    //     }
    // }

    // @Get(':bloggerId/posts')
    // async getPostByBloggerID(@Query() query: {SearchNameTerm: string, PageNumber: string, PageSize: string, sortBy: string, sortDirection: string}, @Param() params, @Req() req) {
    //   try {
    //     const token = req.headers.authorization.split(' ')[1]
    //     const userId = await this.jwtServiceClass.getUserByAccessToken(token)
    //     const paginationData = constructorPagination(query.PageSize as string, query.PageNumber as string, query.sortBy as string, query.sortDirection as string);
    //     const findBlogger: object | undefined = await this.commandBus.execute(new GetAllPostsSpecificBlogCommand(params.bloggerId, paginationData.pageNumber, paginationData.pageSize, userId));
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
    @UseGuards(JwtAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Post()
    async createBlogger(@Body() blogsType: Blogs, @Req() req) {
      const token = req.headers.authorization.split(' ')[1]
      const userId = await this.jwtServiceClass.getUserByAccessToken(token)
      const user = await this.commandBus.execute(new GetUserByUserIdCommand(userId))
      const createrPerson: BloggersType | null = await this.commandBus.execute(new CreateBlogByBloggerCommand(blogsType.name, blogsType.websiteUrl, blogsType.description, userId, user.login ));
      if (createrPerson !== null) {
        return createrPerson
      }
      else { 
        throw new HttpException('Opps check input Data',HttpStatus.BAD_REQUEST)
      }
    }
    @UseGuards(JwtAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Post(':blogId/posts')
    async createPostByBloggerId(@Param() params, @Body() post: PostTypeValidator, @Req() req) {
      const token = req.headers.authorization.split(' ')[1]
      const userId = await this.jwtServiceClass.getUserByAccessToken(token)
      const blogWithUserId: BloggersType = await this.commandBus.execute(new GetTargetBlogCommand(params.blogId, userId))
      const blogWithBlogId: BloggersType = await this.commandBus.execute(new GetTargetBlogCommand(params.blogId, null))
      if (!blogWithBlogId) {throw new HttpException('Check URI param, blog not found',HttpStatus.NOT_FOUND)}
      if (userId !== blogWithUserId?.blogOwnerInfo.userId) {throw new HttpException('Access denied',HttpStatus.FORBIDDEN)}
      if (!blogWithUserId) {throw new HttpException('Blog NOT FOUND',HttpStatus.NOT_FOUND)}
      const createPostForSpecificBlogger: string | object | null = await this.commandBus.execute(new CreatePostByBloggerCommand(post.title, post.content, post.shortDescription, params.blogId));
      return createPostForSpecificBlogger;
  
    } 
    @UseGuards(JwtAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':id')
    async updateBlogger(@Param() params, @Body() blogsType: Blogs, @Req() req) {
      const token = req.headers.authorization.split(' ')[1]
      const userId = await this.jwtServiceClass.getUserByAccessToken(token)
      const blogWithUserId: BloggersType = await this.commandBus.execute(new GetTargetBlogCommand(null, userId))
      const blogWithBlogId: BloggersType = await this.commandBus.execute(new GetTargetBlogCommand(params.id, null))
      if (!blogWithUserId) {throw new HttpException('Access denied',HttpStatus.FORBIDDEN) }
      if (!blogWithBlogId) {throw new HttpException('Blog NOT FOUND',HttpStatus.NOT_FOUND)}
      //const checkForbidden = await this.commandBus.execute(new CheckForbiddenCommand(params.id, userId))
      // const foundPost = await this.commandBus.execute(new GetSinglePostCommand(params.id))
      //if (token?.id !== blogger?.blogOwnerInfo.userId) {throw new HttpException('Access denied',HttpStatus.FORBIDDEN) }
      //if (checkForbidden == false) {throw new HttpException('Access denied',HttpStatus.FORBIDDEN) }
      const alreadyChanges: string = await this.commandBus.execute(new UpdateBlogByBloggerCommand(params.id, blogsType.name, blogsType.websiteUrl, blogsType.description));
      throw new HttpException(alreadyChanges, HttpStatus.NO_CONTENT)
    }
    @UseGuards(JwtAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':blogId/posts/:postId')
    async updatePost(@Param() params, @Body() postInput: PostTypeValidator, @Req() req) {
      const token = req.headers.authorization.split(' ')[1]
      const userId = await this.jwtServiceClass.getUserByAccessToken(token)
      // const postWithUserId: BloggersType = await this.commandBus.execute(new GetTargetBlogCommand(null, userId))
      // if (!blogWithUserId) {throw new HttpException('Access denied',HttpStatus.FORBIDDEN) }
      const foundPost = await this.commandBus.execute(new GetSinglePostCommand(params.postId))
      if (!foundPost) {throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)}

      const blogWithBlogId: BloggersType = await this.commandBus.execute(new GetTargetBlogCommand(params.blogId, null))
      if (!blogWithBlogId) {throw new HttpException('Blog NOT FOUND',HttpStatus.NOT_FOUND)}

      const checkForbidden = await this.commandBus.execute(new CheckForbiddenCommand(params.postId, userId))
      if (checkForbidden == false) {throw new HttpException('Access denied',HttpStatus.FORBIDDEN) }
      
      const alreadyChanges: string = await this.commandBus.execute(new UpdatePostCommand(params.postId, postInput.title, postInput.shortDescription, postInput.content, params.blogId));
      throw new HttpException(alreadyChanges, HttpStatus.NO_CONTENT)
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteOneBlog(@Param() params, @Req() req) {
      const token = req.headers.authorization.split(' ')[1]
      const userId = await this.jwtServiceClass.getUserByAccessToken(token)
      const blogWithUserId: BloggersType = await this.commandBus.execute(new GetTargetBlogCommand(null, userId))
      const blogWithBlogId: BloggersType = await this.commandBus.execute(new GetTargetBlogCommand(params.id, null))
      if (!blogWithUserId) {throw new HttpException('Access denied',HttpStatus.FORBIDDEN) }
      if (!blogWithBlogId) {throw new HttpException('Blog NOT FOUND',HttpStatus.NOT_FOUND)}
      const afterDelete = await this.commandBus.execute(new DeleteBlogForSpecificBloggerCommand(params.id, userId));
      if (afterDelete) {
        throw new HttpException('Delete succefully',HttpStatus.NO_CONTENT)
      }
      else {
        throw new HttpException('Blogger NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':blogId/posts/:postId')
    async deletePostById(@Param() params, @Req() req) {
      const token = req.headers.authorization.split(' ')[1]
      const userId = await this.jwtServiceClass.getUserByAccessToken(token)
      const targetPost = await this.commandBus.execute(new GetSinglePostCommand(params.postId, userId))
      if (targetPost == null || targetPost == undefined) { throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND)}
      const checkForbidden = await this.commandBus.execute(new CheckForbiddenCommand(params.postId, userId))
      if (checkForbidden == false) {throw new HttpException('Access denied',HttpStatus.FORBIDDEN) }
        const deleteObj: boolean = await this.commandBus.execute(new DeletePostByBloggerCommand(params.blogId, params.postId));
        if (deleteObj === true) {
            //return HttpStatus.NO_CONTENT
            throw new HttpException('Post was DELETED', HttpStatus.NO_CONTENT)
        }
        else {
            throw new HttpException('Post NOT FOUND', HttpStatus.NOT_FOUND)
        }
    }
  }