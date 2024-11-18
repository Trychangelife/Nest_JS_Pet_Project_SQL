import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Request, Res, UseFilters, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { InjectDataSource } from "@nestjs/typeorm";
import { AuthForm } from "src/auth/dto/AuthForm_validator";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { BasicAuthGuard } from "src/guards/basic_auth_guard";
import { UserRegistrationFlow } from "src/guards/users.registration.guard";
import { constructorPagination } from "src/utils/pagination.constructor";
import { DataSource } from "typeorm";
import { BanStatus } from "../SAblog/dto/banStatus";
import { BanUserAsSuperAdminCommand } from "./application/useCases/ban_user_SA";
import { CreateUserSACommand } from "./application/useCases/create_user_SA";
import { DeleteUserAsSuperAdminCommand } from "./application/useCases/delete_user_SA";
import { GetAllUsersAsSuperAdminCommand } from "./application/useCases/get_all_user_SA";
import { BanUserInputModel } from "./dto/banUserInputModel";
import { userViewModel } from "src/users/dto/UsersType";

@Controller('sa/users')
export class SuperAdminUsersController {

    constructor(private commandBus: CommandBus,
      @InjectDataSource() protected dataSource: DataSource) {
    }
    @Post()
    @UseGuards(BasicAuthGuard)
    @UseGuards(UserRegistrationFlow)
    @UseFilters(new HttpExceptionFilter())
    async createUser(@Body() user: AuthForm,  @Request() req: {ip: string},  @Res() res) {
        const result: userViewModel | null = await this.commandBus.execute(new CreateUserSACommand(user.password, user.login, user.email, req.ip));
        console.log("result:", result)
       if (result == null) {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS)
        }
        else {
            res
                .status(201)
                .send(result)
        }
    }

    @UseGuards(BasicAuthGuard)
    //@UseGuards(RateLimitGuard)
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