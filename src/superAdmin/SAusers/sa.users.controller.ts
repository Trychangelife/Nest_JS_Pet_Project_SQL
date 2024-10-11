import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Request, Res, UseFilters, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { AuthForm } from "src/auth/dto/AuthForm_validator";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { BasicAuthGuard } from "src/guards/basic_auth_guard";
import { UserRegistrationFlow } from "src/guards/users.registration.guard";
import { UsersType } from "src/users/dto/UsersType";
import { CreateUserSACommand } from "./application/useCases/create_user_SA";
import { constructorPagination } from "src/utils/pagination.constructor";
import { GetAllUsersAsSuperAdminCommand } from "./application/useCases/get_all_user_SA";
import { DeleteUserAsSuperAdminCommand } from "./application/useCases/delete_user_SA";
import { BanUserAsSuperAdminCommand } from "./application/useCases/ban_user_SA";
import { BanUserInputModel } from "./dto/banUserInputModel";
import { BanStatus } from "../SAblog/dto/banStatus";

@Controller('sa/users')
export class SuperAdminUsersController {

    constructor(private commandBus: CommandBus) {
    }
    
    @Post()
    @UseGuards(BasicAuthGuard)
    @UseGuards(UserRegistrationFlow)
    @UseFilters(new HttpExceptionFilter())
    async createUser(@Body() user: AuthForm,  @Request() req: {ip: string},  @Res() res) {
        const result: UsersType | boolean = await this.commandBus.execute(new CreateUserSACommand(user.password, user.login, user.email, req.ip));
        if (result == false) {
            throw new HttpException("", HttpStatus.BAD_REQUEST)
        }
        else if (result == null) {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS)
        }
        else {
            res
                .status(201)
                .send(result)
        }
    }

    @UseGuards(BasicAuthGuard)
    @Get()
    async getAllUsers(@Query() query: {searchEmailTerm: string, searchLoginTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string, banStatus: BanStatus}) {
        const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string, query.searchEmailTerm as string, query.searchLoginTerm as string);
        const resultUsers = await this.commandBus.execute(new GetAllUsersAsSuperAdminCommand(paginationData.pageSize, paginationData.pageNumber, paginationData.sortDirection, paginationData.sortBy, paginationData.searchEmailTerm, paginationData.searchLoginTerm, query.banStatus));
        return resultUsers
    }
    @UseGuards(BasicAuthGuard)
    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
        const afterDelete = await this.commandBus.execute(new DeleteUserAsSuperAdminCommand(id as string));
        if (afterDelete == true) {
          throw new HttpException('User was deleted',HttpStatus.NO_CONTENT)
        }
        else {
          throw new HttpException('User NOT FOUND',HttpStatus.NOT_FOUND)
        }

    }

    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':id/ban')
    async banUser(@Param('id') id: string, @Body() banInputModel: BanUserInputModel) {
        const afterBan = await this.commandBus.execute(new BanUserAsSuperAdminCommand(id as string, banInputModel.banReason, banInputModel.isBanned));
        if (afterBan == true) {
          throw new HttpException('User was banned',HttpStatus.NO_CONTENT)
        }
        else {
          throw new HttpException('User NOT FOUND',HttpStatus.NOT_FOUND)
        }

    }
    
}