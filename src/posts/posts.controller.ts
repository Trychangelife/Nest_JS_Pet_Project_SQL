import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, ParseEnumPipe, Post, Put, Query, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Comment } from "src/comments/dto/Comment_validator_type";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { BasicAuthGuard } from "src/guards/basic_auth_guard";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { JwtFakeAuthGuard } from "src/guards/jwt-fake-auth.guard";
import { JwtServiceClass } from "src/guards/jwt.service";
import { PostTypeValidatorForCreate } from "src/posts/dto/PostTypeValidator";
import { constructorPagination } from "src/utils/pagination.constructor";
import { LIKES } from "src/utils/types";
import { PostsService } from "./application/posts.service";
import { CreateCommentForSpecificPostCommand } from "./application/use-cases/create_comment_for_specific_post";
import { CreatePostCommand } from "./application/use-cases/create_post";
import { GetAllPostsCommand } from "./application/use-cases/get_all_posts";
import { GetCommentByPostIdCommand } from "./application/use-cases/get_comments_by_postID";
import { GetSinglePostCommand } from "./application/use-cases/get_single_post";
import { LikeDislikeForPostCommand } from "./application/use-cases/like_dislike_for_post";
import { UpdatePostCommand } from "./application/use-cases/update_post";
import { PostsType } from "./dto/PostsType";

@Controller('posts')
export class PostController {

    constructor(
        protected postsService: PostsService,
        protected jwtServiceClass: JwtServiceClass,
        private commandBus: CommandBus,
    ) {
    }
    @UseGuards(JwtFakeAuthGuard)
    @Get()
    async getAllPost(@Query() query: { pageNumber: string, pageSize: string, sortBy: string, sortDirection: string }, @Req() req) {
        const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
        const userId = req?.user?.id ?? null;
        const full: object = await this.commandBus.execute(new GetAllPostsCommand( paginationData.pageSize, paginationData.pageNumber,  paginationData.sortBy, paginationData.sortDirection, userId));
        return full
    }
    @UseGuards(JwtFakeAuthGuard)
    @Get(':id')
    async getPostByID(@Param() params, @Req() req) {
            //const token = req.headers.authorization.split(' ')[1]
            //const userId = await this.jwtServiceClass.getUserByAccessToken(token)
            const userId = req?.user?.id ?? null;
            const takePost: PostsType | null = await this.commandBus.execute(new GetSinglePostCommand(params.id, userId)) // Тут еще был userId из токена
            //const checkBan = await this.commandBus.execute(new CheckBanStatusSuperAdminCommand(null, takePost?.blogId))
            if (takePost !== null) { 
            //if (takePost !== undefined && checkBan !== true && checkBan !== null) { - раскомментирую когда дойду до банов
                return takePost
            }
            else {
                throw new HttpException('Post NOT FOUND', HttpStatus.NOT_FOUND)
            }
    }
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Post()
    async createPost(@Body() post: PostTypeValidatorForCreate, @Res() res) {
        console.log("попал в контролер")
        const createdPost: string | object | null = await this.commandBus.execute(new CreatePostCommand(post.title, post.content, post.shortDescription, post.userId, post.blogId));
        if (createdPost == null) {
            throw new HttpException('Something wrong, check input data', HttpStatus.BAD_REQUEST)
            // res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "blogId" }], resultCode: 1 });
        }
        else {
            res.status(201).send(createdPost)
            //throw new HttpException(createdPost ,HttpStatus.CREATED);
        }
    }
    @UseGuards(BasicAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Put(':postId')
    async updatePost(@Param() params, @Body() post: PostTypeValidatorForCreate, @Req() req) {
        const afterChanged: object | string = await this.commandBus.execute(new UpdatePostCommand(params.postId, post.title, post.shortDescription, post.content, post.blogId));
        if (afterChanged !== "404" && afterChanged !== '400') {
            //throw new HttpException(afterChanged,HttpStatus.ACCEPTED)
            throw new HttpException(afterChanged, HttpStatus.NO_CONTENT)
        }
        else if (afterChanged === "400") {
            throw new HttpException('Something wrong, check input data', HttpStatus.BAD_REQUEST)
            //res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 });
        }
        else {
            throw new HttpException('Post NOT FOUND', HttpStatus.NOT_FOUND)
        }

    }

    @UseGuards(JwtAuthGuard)
    @UseFilters(new HttpExceptionFilter())
    @Post(':postId/comments')
    async createCommentForPost(@Param('postId') postId: string, @Body() content: Comment, @Req() req) {
        const user = req?.user ?? null;
        const newComment = await this.commandBus.execute(new CreateCommentForSpecificPostCommand(postId, content.content, user.id, user.login));
        if (newComment) {
            return newComment
        }
        else {
            throw new HttpException('Post NOT FOUND', HttpStatus.NOT_FOUND)
        }

    }
    @UseGuards(JwtFakeAuthGuard)
    @Get(':postId/comments')
    async getCommentsByPostId(@Query() query: { searchNameTerm: string, pageNumber: string, pageSize: string, sortBy: string, sortDirection: string }, @Param() params, @Req() req) {
            const userId = req?.user?.id ?? null;
            //const token = req.headers.authorization.split(' ')[1]
            //const userId = await this.jwtServiceClass.getUserByAccessToken(token)
            const paginationData = constructorPagination(query.pageSize as string, query.pageNumber as string, query.sortBy as string, query.sortDirection as string);
            const newComment = await this.commandBus.execute(new GetCommentByPostIdCommand(params.postId, paginationData.pageNumber, paginationData.pageSize, paginationData.sortBy, paginationData.sortDirection, userId));
            if (newComment) {
                return newComment
            }
            else {
                throw new HttpException("Comment doesn't exists", HttpStatus.NOT_FOUND)
            }
    }

    @UseGuards(JwtAuthGuard)
    @Put(':postId/like-status')
    async like_dislike(
        @Param('postId') postId: string,
        @Body('likeStatus', new ParseEnumPipe(LIKES, {
            errorHttpStatusCode: HttpStatus.BAD_REQUEST,
            exceptionFactory: error => {
                throw new BadRequestException({
                    errorsMessages: [{
                        message: error,
                        field: "likeStatus"
                    }]
                })
            }
        })) likeStatus: LIKES, @Req() req) {
        //await this.postsService.targetPosts()
        const like_dislike: object | string = await this.commandBus.execute(new LikeDislikeForPostCommand(postId, likeStatus, req.user!.id, req.user!.login));
        if (like_dislike !== "404" && like_dislike !== '400') {
            throw new HttpException(like_dislike, HttpStatus.NO_CONTENT)
        }
        else if (like_dislike === "400") {
            throw new HttpException({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 }, HttpStatus.BAD_REQUEST)
            //res.status(400).json({ errorsMessages: [{ message: "blogger not found", field: "bloggerId" }], resultCode: 1 });
        }
        else {
            throw new HttpException('Post NOT FOUND', HttpStatus.NOT_FOUND)
        }
    }
}