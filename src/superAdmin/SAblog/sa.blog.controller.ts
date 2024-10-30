import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UseFilters, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { constructorPagination } from "src/utils/pagination.constructor";
import { GetAllBlogsSuperAdminCommand } from "./application/use-cases/get_all_blogs";
import { BasicAuthGuard } from "src/guards/basic_auth_guard";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { Blogs } from "src/blogs/dto/Blog_validator_type";
import { BindingBlogSuperAdminCommand } from "./application/use-cases/binding_blog";
import { GetTargetBlogCommand } from "src/blogs/application/use-cases/get_target_blog";
import { BanStatus } from "./dto/banStatus";
import { BlogsTypeView } from "src/blogs/dto/BlogsType";
import { CreateBlogCommand } from "./application/use-cases/create_blog";
import { UpdateBlogCommand } from "./application/use-cases/update_blog";
import { DeleteBlogCommand } from "./application/use-cases/delete_single_blog";
import { PostTypeValidator } from "src/posts/dto/PostTypeValidator";
import { CreatePostCommand } from "src/posts/application/use-cases/create_post";
import { GetAllPostsSpecificBlogCommand } from "./application/use-cases/get_all_posts_specific_blog";
import { UpdatePostCommand } from "src/posts/application/use-cases/update_post";
import { PostsTypeView } from "src/posts/dto/PostsType";
import { DeletePostCommand } from "src/posts/application/use-cases/delete_post";

@Controller('sa/blogs')
export class SuperAdminBlogsController {

    constructor(private commandBus: CommandBus) {
    }
    
    // Returns all blogs with paging
    @UseGuards(BasicAuthGuard)
    @Get()
    async getAllBlogs(@Query() query: {searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}) {
      const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;
      const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
      const full: object = await this.commandBus.execute(new GetAllBlogsSuperAdminCommand(paginationData.pageSize, paginationData.pageNumber, searchNameTerm, paginationData.sortBy, paginationData.sortDirection));
      return full
    }

    // Return posts for blog with paging and sorting
    @UseGuards(BasicAuthGuard)
    @Get(':blogId/posts')
    async getAllPostByBlogId(@Param() params, @Query() query: { pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}) {
      const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
      const full: object = await this.commandBus.execute(new GetAllPostsSpecificBlogCommand(params.blogId, paginationData.pageNumber, paginationData.pageSize, paginationData.sortBy, paginationData.sortDirection));
      return full
    }
    
    //Create new blog
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Post()
    async createBlog(@Body() blogsType: Blogs) {
  
      const createrPerson: BlogsTypeView | null = await this.commandBus.execute(new CreateBlogCommand(blogsType.name, blogsType.websiteUrl, blogsType.description ));
      if (createrPerson !== null) {
        return createrPerson
      }
      else { 
        throw new HttpException('Opps check input Data',HttpStatus.BAD_REQUEST)
      }
    }

    // Update existing Blog by id with InputModel
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':id')
    async updateBlog(@Param() params, @Body() blogsType: Blogs) {
      const alreadyChanges: string = await this.commandBus.execute(new UpdateBlogCommand(params.id, blogsType.name, blogsType.websiteUrl, blogsType.description));
      if (alreadyChanges) {
        throw new HttpException('Update succefully', HttpStatus.NO_CONTENT)
      }
      else {
        throw new HttpException('Blog NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }

    // Update existing post by id with InputModel
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':blogId/posts/:postId')
    async updatePostByBlogId(@Param() params, @Body() postsType: PostTypeValidator) {
      const alreadyChanges: boolean | null = await this.commandBus.execute(new UpdatePostCommand(params.postId, params.blogId, postsType.title, postsType.shortDescription, postsType.content));
      if (alreadyChanges) {
        throw new HttpException('Update succefully', HttpStatus.NO_CONTENT)
      }
      else {
        throw new HttpException('Blog NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }

    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Delete(':blogId/posts/:postId')
    async deletePostByBlogId(@Param() params) {
      const alreadyDeleted: boolean | null = await this.commandBus.execute(new DeletePostCommand(params.postId, params.blogId));
      if (alreadyDeleted) {
        throw new HttpException('Update succefully', HttpStatus.NO_CONTENT)
      }
      else {
        throw new HttpException('Post NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }

    // Delete blog specified by ID
    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    async deleteOneBlog(@Param() params) {
      const afterDelete = await this.commandBus.execute(new DeleteBlogCommand(params.id));
      if (afterDelete === "204") {
        throw new HttpException('Delete succefully',HttpStatus.NO_CONTENT)
      }
      else {
        throw new HttpException('Blog NOT FOUND',HttpStatus.NOT_FOUND)
      }
    }

    // Create new POST for specific blog
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Post(':id/posts')
    async createPostByBloggerId(@Param() params, @Body() post: PostTypeValidator) {
      const blog = await this.commandBus.execute(new GetTargetBlogCommand(params.id))
      if (blog == undefined || blog == null) { throw new HttpException('Blog NOT FOUND',HttpStatus.NOT_FOUND) }
  
      const createPostForSpecificBlogger: string | object | null = await this.commandBus.execute(new CreatePostCommand(post.title, post.content, post.shortDescription, post.blogId, params.id));
      return createPostForSpecificBlogger;
  
    }



    //
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':id/bind-with-user/:userId')
    async updateBlogger(@Param() params) {
      const getBlog = await this.commandBus.execute(new GetTargetBlogCommand(params.id))
      if (getBlog == true) {
        if (getBlog.blogOwnerInfo.userId !== null) {
          await this.commandBus.execute(new BindingBlogSuperAdminCommand(params.id, params.userId));
          throw new HttpException('Binding succefully', HttpStatus.NO_CONTENT)
        }
        else {
          throw new HttpException('Blogs already binding',HttpStatus.BAD_REQUEST)
        }
      }
      
    }
}