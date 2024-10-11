import 'dotenv/config'
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ServerApiVersion } from 'mongodb';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nest-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsRepository } from './blogs/repositories/blogs.repository';
import { PostRepository } from './posts/repositories/posts.repository';
import { PostsRepositorySql } from './posts/repositories/posts.sql.repository';
import { BlogsController } from './blogs/blogs.controller';
import { PostController } from './posts/posts.controller';
import { BloggersController } from './bloggers/bloggers.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { PostsService } from './posts/application/posts.service';
import { authDataSchema, blogsSchema, commentsSchema, postSchema, refreshTokenSchema, usersSchema, registrationDataSchema, emailSendSchema, codeConfirmSchema, recoveryPasswordSchema, newPasswordSchema } from './db';
import { UsersService } from './users/application/users.service';
import { AuthService } from './auth/application/auth.service';
import { CommentsService } from './comments/application/comments.service';
import { AuthController } from './auth/auth.controller';
import { CommentsController } from './comments/comments.controller';
import { UsersController } from './users/users.controller';
import { EmailService } from './email/email.service';
import { JwtServiceClass } from './guards/jwt.service';
import { UsersRepository } from './users/repositories/users.repository';
import { CommentsRepository } from './comments/repositories/comments.repository';
import { EmailManager } from './email/email.manager';
import { EmailAdapter } from './email/email.adapter';
import { FullDataController } from './full_delete_for_dev/full_delete.controller';
import { FullDeleteModule } from './full_delete_for_dev/full_delete.module';
import { SecurityDeviceController } from './security_devices/security.controller';
import { SecurityDeviceService } from './security_devices/application/security.service';
import { SecurityDeviceRepository } from './security_devices/repostitories/security.repository';
import { BlogIsExistRule } from './posts/validator.posts.form';
import { BlogsRepositorySql } from './blogs/repositories/blogs.sql.repository';
import { GetAllBlogsUseCase } from './blogs/application/use-cases/get_all_blogs';
import { CqrsModule } from '@nestjs/cqrs';
import { GetTargetBlogUseCase } from './blogs/application/use-cases/get_target_blog';
import { CreateBlogUseCase } from './blogs/application/use-cases/create_blog';
import { UpdateBlogUseCase } from './blogs/application/use-cases/update_blog';
import { DeleteBlogUseCase } from './blogs/application/use-cases/delete_single_blog';
import { GetAllPostsUseCase } from './posts/application/use-cases/get_all_posts';
import { GetSinglePostUseCase } from './posts/application/use-cases/get_single_post';
import { GetAllPostsSpecificBlogUseCase } from './posts/application/use-cases/get_all_posts_specific_blog';
import { CreatePostUseCase } from './posts/application/use-cases/create_post';
import { UpdatePostUseCase } from './posts/application/use-cases/update_post';
import { DeletePostUseCase } from './posts/application/use-cases/delete_post';
import { CreateCommentForSpecificPostUseCase } from './posts/application/use-cases/create_comment_for_specific_post';
import { GetCommentByPostIdUseCase } from './posts/application/use-cases/get_comments_by_postID';
import { LikeDislikeForPostUseCase } from './posts/application/use-cases/like_dislike_for_post';
import { GetCommentUseCase } from './comments/application/use-cases/Get_comment_by_id';
import { DeleteCommentUseCase } from './comments/application/use-cases/Delete_comment_by_id';
import { UpdateCommentUseCase } from './comments/application/use-cases/Update_Comment_By_Comment_Id';
import { LikeDislikeCommentUseCase } from './comments/application/use-cases/Like_dislike_for_comment';
import { GetAllDevicesUseCase } from './security_devices/application/use-cases/Get_all_devices';
import { TerminateAllSessionUseCase } from './security_devices/application/use-cases/Terminate_all_session';
import { TerminateSessionByIdUseCase } from './security_devices/application/use-cases/Terminate_target_session_by_id';
import { FoundUserByDeviceIdUseCase } from './security_devices/application/use-cases/Found_user_by_device_id';
import { SuperAdminBlogsController } from './superAdmin/SAblog/sa.blog.controller';
import { GetAllBlogsSuperAdminUseCase } from './superAdmin/SAblog/application/get_all_blogs';
import { BlogsSuperAdminRepository } from './superAdmin/SAblog/repositories/blogs.SA.repository';
import { CreateBlogByBloggerUseCase } from './bloggers/application/use-cases/create_blog';
import { BlogsByBloggerRepository } from './bloggers/repositories/bloggers.repository';
import { GetUserByUserIdUseCase } from './users/application/use-cases/Get_user_by_id';
import { GetAllBlogsforBloggerUseCase } from './bloggers/application/use-cases/get_all_blogs';
import { SuperAdminUsersController } from './superAdmin/SAusers/sa.users.controller';
import { CreateUserSAUseCase } from './superAdmin/SAusers/application/useCases/create_user_SA';
import { SuperAdminUsersRepository } from './superAdmin/SAusers/repositories/SuperAdmin.user.repository';
import { GetAllUsersAsSuperAdminUseCase } from './superAdmin/SAusers/application/useCases/get_all_user_SA';
import { DeleteUserAsSuperAdminUseCase } from './superAdmin/SAusers/application/useCases/delete_user_SA';
import { BanUserAsSuperAdminUseCase } from './superAdmin/SAusers/application/useCases/ban_user_SA';
import { BindingBlogSuperAdminUseCase } from './superAdmin/SAblog/application/binding_blog';
import { DeleteBlogForSpecificBloggerUseCase } from './bloggers/application/use-cases/delete_single_blog';
import { CreatePostByBloggerUseCase } from './bloggers/application/use-cases/create_Post';
import { UpdateBlogByBloggerUseCase } from './bloggers/application/use-cases/update_blog';
import { DeletePostByBloggerUseCase } from './bloggers/application/use-cases/delete_post_by_id';
import { CheckBanStatusSuperAdminUseCase } from './superAdmin/SAusers/application/useCases/check_banStatus';
import { CheckForbiddenUseCase } from './posts/application/use-cases/check_forbidden';




const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};
const uri:string = process.env.mongoURI

const useCasesBlogs = [GetAllBlogsUseCase, GetTargetBlogUseCase, CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase]
const useCasesPosts = [GetAllPostsUseCase, GetSinglePostUseCase, GetAllPostsSpecificBlogUseCase, CreatePostUseCase, UpdatePostUseCase, DeletePostUseCase, CreateCommentForSpecificPostUseCase, GetCommentByPostIdUseCase, LikeDislikeForPostUseCase]
const useCasesComments = [GetCommentUseCase, DeleteCommentUseCase, UpdateCommentUseCase, LikeDislikeCommentUseCase]
const useCasesDevices = [GetAllDevicesUseCase, TerminateAllSessionUseCase,TerminateSessionByIdUseCase, FoundUserByDeviceIdUseCase]
const useCasesByBloggers = [CreateBlogByBloggerUseCase, GetAllBlogsforBloggerUseCase, DeleteBlogForSpecificBloggerUseCase, UpdateBlogByBloggerUseCase, CreatePostByBloggerUseCase, DeletePostByBloggerUseCase]
const useCasesSuperAdminBlogs = [GetAllBlogsSuperAdminUseCase, BindingBlogSuperAdminUseCase]
const useCasesSuperAdminUsers = [CreateUserSAUseCase, CheckBanStatusSuperAdminUseCase, GetAllUsersAsSuperAdminUseCase, DeleteUserAsSuperAdminUseCase, BanUserAsSuperAdminUseCase]
const useCasesUsers = [GetUserByUserIdUseCase]
const UtilityUseCase = [CheckForbiddenUseCase]


const blogsProviders = [BlogsService, ]
const postsProviders = [PostsService]
const commentsProviders = [CommentsService, CommentsRepository,]
const usersProviders = [UsersService, UsersRepository,]
const blogsByBloggersProviders = [BlogsByBloggerRepository]
const emailProviders = [EmailService, EmailManager, EmailAdapter,]
const authProviders = [AuthService,]
const securityDevicesProviders = [SecurityDeviceService, SecurityDeviceRepository,]
const blogsSuperAdminProviders = [BlogsSuperAdminRepository,]
const usersSuperAdminProviders = [SuperAdminUsersRepository, ]


@Module({
  imports: [
  MailerModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (config: ConfigService) => ({
      transport: {
        host: config.get('EMAIL_HOST'),
        secure: false, 
        port: 587,
        auth: {
               user: config.get('EMAIL_USER'),
               pass: config.get('PASSWORD_GMAIL')
            },
      },
    }), inject: [ConfigService]
  }), 
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD, 
    database: process.env.POSTGRES_DATABASE_NAME,
    url: process.env.DATABASE_URL,
    autoLoadEntities: false,
    synchronize: true,
    ssl: true,
  }),
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  }),
  MongooseModule.forRoot(uri, options),
  MongooseModule.forFeature([
    {name: 'Blogs', schema: blogsSchema}, 
    {name: 'Posts', schema: postSchema}, 
    {name: 'Comments', schema: commentsSchema}, 
    {name: 'Users', schema: usersSchema}, 
    {name: 'RefreshToken', schema: refreshTokenSchema},
    {name: 'RegistrationData', schema: registrationDataSchema}, 
    {name: 'AuthData', schema: authDataSchema},
    {name: 'CodeConfirm', schema: codeConfirmSchema},
    {name: 'EmailSend', schema: emailSendSchema},
    {name: 'RecoveryPassword', schema: recoveryPasswordSchema},
    {name: 'NewPassword', schema: newPasswordSchema}
  ]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: {
        expiresIn: '24h'
    }
}), CqrsModule],
  controllers: [AppController, BlogsController, PostController, UsersController, AuthController, CommentsController, FullDataController, SecurityDeviceController, BloggersController, SuperAdminBlogsController, SuperAdminUsersController],
  providers: [AppService,
    {provide: BlogsRepository, useClass: process.env.USE_DATABASE === 'SQL' ? BlogsRepositorySql : BlogsRepository},
    {provide: PostRepository, useClass: process.env.USE_DATABASE === 'SQL' ? PostsRepositorySql: PostRepository},
    JwtServiceClass, FullDeleteModule, BlogIsExistRule, 
    
    // Classic
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    ...usersProviders,
    ...blogsByBloggersProviders,
    ...emailProviders,
    ...authProviders,
    ...securityDevicesProviders,
    ...blogsSuperAdminProviders,
    ...usersSuperAdminProviders,


    ...useCasesBlogs,
    ...useCasesPosts,
    ...useCasesComments,
    ...useCasesDevices,
    ...useCasesSuperAdminBlogs,
    ...useCasesByBloggers,
    ...useCasesUsers,
    ...useCasesSuperAdminUsers,
    ...UtilityUseCase
]
})
export class AppModule {}

