import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Query, UseFilters, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { constructorPagination } from "src/utils/pagination.constructor";
import { GetAllBlogsSuperAdminCommand } from "./application/get_all_blogs";
import { BasicAuthGuard } from "src/guards/basic_auth_guard";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { Blogs } from "src/blogs/dto/Blog_validator_type";
import { BindingBlogSuperAdminCommand } from "./application/binding_blog";
import { GetTargetBlogCommand } from "src/blogs/application/use-cases/get_target_blog";
import { get } from "http";
import { BanStatus } from "./dto/banStatus";

@Controller('sa/blogs')
export class SuperAdminBlogsController {

    constructor(private commandBus: CommandBus) {
    }
    
    @UseGuards(BasicAuthGuard)
    @Get()
    async getAllBlogs(@Query() query: {searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}) {
      const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : null;
      const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
      const allBlogsHowSuperAdmin: object = await this.commandBus.execute(new GetAllBlogsSuperAdminCommand(paginationData.pageSize, paginationData.pageNumber, searchNameTerm, paginationData.sortBy, paginationData.sortDirection));
      return allBlogsHowSuperAdmin
    }
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