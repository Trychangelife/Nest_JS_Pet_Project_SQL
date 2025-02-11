import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Query, Request, UseFilters, UseGuards } from "@nestjs/common";
import { AuthForm } from "src/auth/dto/AuthForm_validator";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { BasicAuthGuard } from "src/guards/basic_auth_guard";
import { UserRegistrationFlow } from "src/guards/users.registration.guard";
import { UsersType, userViewModel } from "src/users/dto/UsersType";
import { constructorPagination } from "src/utils/pagination.constructor";
import { UsersService } from "./application/users.service";


@Controller('users')
export class UsersController {

    constructor(protected usersService: UsersService) {
    }

    @UseGuards(BasicAuthGuard)
    @Get()
    async getAllUsers(@Query() query: {searchEmailTerm: string, searchLoginTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}) {
        const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string, query.searchEmailTerm as string, query.searchLoginTerm as string);
        const resultUsers = await this.usersService.allUsers(paginationData.pageSize, paginationData.pageNumber, paginationData.sortDirection, paginationData.sortBy, paginationData.searchEmailTerm, paginationData.searchLoginTerm);
        return resultUsers
    }
    @Post()
    @UseGuards(BasicAuthGuard)
    @UseGuards(UserRegistrationFlow)
    @UseFilters(new HttpExceptionFilter())
    async createUser(@Body() user: AuthForm,  @Request() req: {ip: string}) {
        const result: userViewModel | boolean = await this.usersService.createUser(user.password, user.login, user.email, req.ip);
        if (result == false) {
          throw new BadRequestException([{message: 'Bad email', field: 'Email'}])
        }
        else {
          return result
        }
    }
    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
        const afterDelete = await this.usersService.deleteUser(id as string);
        if (afterDelete == true) {
          throw new HttpException('User was deleted',HttpStatus.NO_CONTENT)
        }
        else {
          throw new HttpException('User NOT FOUND',HttpStatus.NOT_FOUND)
        }

    }
    @Get(':id')
    async getUserById(@Param(':id') id: string ) {
        const resultSearch = await this.usersService.findUserById(id);
        if (resultSearch !== null) {
            return resultSearch
        }
        else {
          throw new HttpException('User NOT FOUND',HttpStatus.NOT_FOUND)
        }
    }
}