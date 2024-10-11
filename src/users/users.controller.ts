import { BadRequestException, Injectable, Ip, Request, UseFilters, UseGuards } from "@nestjs/common";
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { constructorPagination } from "../utils/pagination.constructor";
import { UsersType } from "src/users/dto/UsersType";
import { UsersService } from "./application/users.service";
import { HttpExceptionFilter } from "../exception_filters/exception_filter";
import { UserRegistrationFlow } from "../guards/users.registration.guard";
import { AuthForm } from "src/auth/dto/AuthForm_validator";
import { BasicAuthGuard } from "src/guards/basic_auth_guard";

class CreateUser {
  @IsEmail()
  email: string
  @MinLength(5)
  @MaxLength(10)
  login: string
  @MinLength(3)
  password: string
}

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
        const result: UsersType | boolean = await this.usersService.createUser(user.password, user.login, user.email, req.ip);
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