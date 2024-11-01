import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseEnumPipe, Put, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { JwtServiceClass } from "src/guards/jwt.service";
import { CommentsService } from "./application/comments.service";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { LikesDTO } from "src/utils/class-validator.form";
import { Comment } from "src/comments/dto/Comment_validator_type";
import { HttpExceptionFilterForLikes } from "src/exception_filters/exception_likes";
import { CommandBus } from "@nestjs/cqrs";
import { GetCommentCommand } from "./application/use-cases/Get_comment_by_id";
import { DeleteCommentCommand } from "./application/use-cases/Delete_comment_by_id";
import { UpdateCommentCommand } from "./application/use-cases/Update_Comment_By_Comment_Id";
import { LikeDislikeCommentCommand } from "./application/use-cases/Like_dislike_for_comment";
import { LIKES } from "src/utils/types";
import { JwtFakeAuthGuard } from "src/guards/jwt-fake-auth.guard";




@Controller('comments')
export class CommentsController {

    constructor(
        protected commentsService: CommentsService, 
        protected jwtServiceClass: JwtServiceClass,
        private commandBus: CommandBus) {
    }

    @UseGuards(JwtFakeAuthGuard)
    @Get(':id')
    async getCommentById(@Param() params, @Req() req) {
        const userId = req?.user?.id ?? null;
        const result = await this.commandBus.execute(new GetCommentCommand(params.id, userId)); // здесь был UserID
        //const checkBan = await this.commandBus.execute(new CheckBanStatusSuperAdminCommand(result?.commentatorInfo.userId, null))
        //if (result !== null && checkBan !== true && checkBan !== null) {
        if (result !== null) {
            return result
        }
        else {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
        }
    // } catch (error) {
    //     const result: CommentsType | null = await this.commandBus.execute(new GetCommentCommand(params.id))
    //     //Восстановить когда потребуется фунционал бана
    //     //const checkBan = await this.commandBus.execute(new CheckBanStatusSuperAdminCommand(result?.commentatorInfo.userId, null))
    //     //if (result !== null && checkBan !== true && checkBan !== null) {
    //     if (result !== null && result !== undefined) {
    //         return result
    //     }
    //     else {
    //         throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
    //     }
    //}   
    }



    @UseGuards(JwtAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':commentId')
    @HttpCode(204)
    async updateCommentByCommentId(@Param() params, @Body() content: Comment, @Req() req, @Res() res) {
        const result = await this.commandBus.execute(new UpdateCommentCommand(params.commentId, content.content, req.user!.id));
        if (result) {
            res.send('update done')
        }
        else if (result == null) {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
        }
        else {
            throw new HttpException('FORBIDDEN',HttpStatus.FORBIDDEN)
        }
    }
    @UseGuards(JwtAuthGuard)
    @Delete(':Id')
    @HttpCode(204)
    async deleteCommentById(@Param() params, @Req() req, @Res() res) {
        const resultDelete = await this.commandBus.execute(new DeleteCommentCommand(params.Id, req.user!.id));
        
        if (resultDelete) {
            res.send('delete done')
        }
        else if (resultDelete == null) {
            throw new HttpException('Comments NOT FOUND',HttpStatus.NOT_FOUND)
        }
        else {
            throw new HttpException('FORBIDDEN',HttpStatus.FORBIDDEN)
        }
    }
    
    @UseGuards(JwtAuthGuard)
    @UseFilters(new HttpExceptionFilterForLikes())
    @Put(':commentId/like-status')
    async like_dislike(@Param() params, @Body('likeStatus', new ParseEnumPipe(LIKES, {
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: error => {
            throw new BadRequestException({
                errorsMessages: [{
                    message: error,
                    field: "likeStatus"
                }]
            })
        }
    })) likeStatus: LIKES, @Req() req, @Res() res) {
        const like_dislike: object | string = await this.commandBus.execute(new LikeDislikeCommentCommand(params.commentId, likeStatus, req.user!.id, req.user!.login));
        if (like_dislike !== "404" && like_dislike !== '400') {
            throw new HttpException(like_dislike,HttpStatus.NO_CONTENT)
        }
        else if (like_dislike === "400") {
            throw new HttpException({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 },HttpStatus.BAD_REQUEST)
            //res.status(400).json({ errorsMessages: [{ errorsMessages: [{ message: "Any<String>", field: "likeStatus" }] }]});
        }
        else {
            throw new HttpException('Comment NOT FOUND',HttpStatus.NOT_FOUND)
        }
    }
}
