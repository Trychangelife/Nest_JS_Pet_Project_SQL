"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
require("dotenv/config");
const mongoose_1 = require("@nestjs/mongoose");
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mailer_1 = require("@nest-modules/mailer");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const blogs_repository_1 = require("./blogs/repositories/blogs.repository");
const posts_repository_1 = require("./posts/repositories/posts.repository");
const posts_sql_repository_1 = require("./posts/repositories/posts.sql.repository");
const blogs_controller_1 = require("./blogs/blogs.controller");
const posts_controller_1 = require("./posts/posts.controller");
const bloggers_controller_1 = require("./bloggers/bloggers.controller");
const blogs_service_1 = require("./blogs/application/blogs.service");
const posts_service_1 = require("./posts/application/posts.service");
const db_1 = require("./db");
const users_service_1 = require("./users/application/users.service");
const auth_service_1 = require("./auth/application/auth.service");
const comments_service_1 = require("./comments/application/comments.service");
const auth_controller_1 = require("./auth/auth.controller");
const comments_controller_1 = require("./comments/comments.controller");
const users_controller_1 = require("./users/users.controller");
const email_service_1 = require("./email/email.service");
const jwt_service_1 = require("./guards/jwt.service");
const users_repository_1 = require("./users/repositories/users.repository");
const comments_repository_1 = require("./comments/repositories/comments.repository");
const email_manager_1 = require("./email/email.manager");
const email_adapter_1 = require("./email/email.adapter");
const full_delete_controller_1 = require("./full_delete_for_dev/full_delete.controller");
const full_delete_module_1 = require("./full_delete_for_dev/full_delete.module");
const security_controller_1 = require("./security_devices/security.controller");
const security_service_1 = require("./security_devices/application/security.service");
const security_repository_1 = require("./security_devices/repostitories/security.repository");
const validator_posts_form_1 = require("./posts/validator.posts.form");
const blogs_sql_repository_1 = require("./blogs/repositories/blogs.sql.repository");
const get_all_blogs_1 = require("./blogs/application/use-cases/get_all_blogs");
const cqrs_1 = require("@nestjs/cqrs");
const get_target_blog_1 = require("./blogs/application/use-cases/get_target_blog");
const create_blog_1 = require("./blogs/application/use-cases/create_blog");
const update_blog_1 = require("./blogs/application/use-cases/update_blog");
const delete_single_blog_1 = require("./blogs/application/use-cases/delete_single_blog");
const get_all_posts_1 = require("./posts/application/use-cases/get_all_posts");
const get_single_post_1 = require("./posts/application/use-cases/get_single_post");
const get_all_posts_specific_blog_1 = require("./posts/application/use-cases/get_all_posts_specific_blog");
const create_post_1 = require("./posts/application/use-cases/create_post");
const update_post_1 = require("./posts/application/use-cases/update_post");
const delete_post_1 = require("./posts/application/use-cases/delete_post");
const create_comment_for_specific_post_1 = require("./posts/application/use-cases/create_comment_for_specific_post");
const get_comments_by_postID_1 = require("./posts/application/use-cases/get_comments_by_postID");
const like_dislike_for_post_1 = require("./posts/application/use-cases/like_dislike_for_post");
const Get_comment_by_id_1 = require("./comments/application/use-cases/Get_comment_by_id");
const Delete_comment_by_id_1 = require("./comments/application/use-cases/Delete_comment_by_id");
const Update_Comment_By_Comment_Id_1 = require("./comments/application/use-cases/Update_Comment_By_Comment_Id");
const Like_dislike_for_comment_1 = require("./comments/application/use-cases/Like_dislike_for_comment");
const Get_all_devices_1 = require("./security_devices/application/use-cases/Get_all_devices");
const Terminate_all_session_1 = require("./security_devices/application/use-cases/Terminate_all_session");
const Terminate_target_session_by_id_1 = require("./security_devices/application/use-cases/Terminate_target_session_by_id");
const Found_user_by_device_id_1 = require("./security_devices/application/use-cases/Found_user_by_device_id");
const sa_blog_controller_1 = require("./superAdmin/SAblog/sa.blog.controller");
const get_all_blogs_2 = require("./superAdmin/SAblog/application/get_all_blogs");
const blogs_SA_repository_1 = require("./superAdmin/SAblog/repositories/blogs.SA.repository");
const create_blog_2 = require("./bloggers/application/use-cases/create_blog");
const bloggers_repository_1 = require("./bloggers/repositories/bloggers.repository");
const Get_user_by_id_1 = require("./users/application/use-cases/Get_user_by_id");
const get_all_blogs_3 = require("./bloggers/application/use-cases/get_all_blogs");
const sa_users_controller_1 = require("./superAdmin/SAusers/sa.users.controller");
const create_user_SA_1 = require("./superAdmin/SAusers/application/useCases/create_user_SA");
const SuperAdmin_user_repository_1 = require("./superAdmin/SAusers/repositories/SuperAdmin.user.repository");
const get_all_user_SA_1 = require("./superAdmin/SAusers/application/useCases/get_all_user_SA");
const delete_user_SA_1 = require("./superAdmin/SAusers/application/useCases/delete_user_SA");
const ban_user_SA_1 = require("./superAdmin/SAusers/application/useCases/ban_user_SA");
const binding_blog_1 = require("./superAdmin/SAblog/application/binding_blog");
const delete_single_blog_2 = require("./bloggers/application/use-cases/delete_single_blog");
const create_Post_1 = require("./bloggers/application/use-cases/create_Post");
const update_blog_2 = require("./bloggers/application/use-cases/update_blog");
const delete_post_by_id_1 = require("./bloggers/application/use-cases/delete_post_by_id");
const check_banStatus_1 = require("./superAdmin/SAusers/application/useCases/check_banStatus");
const check_forbidden_1 = require("./posts/application/use-cases/check_forbidden");
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: mongodb_1.ServerApiVersion.v1,
};
const uri = process.env.mongoURI;
const useCasesBlogs = [get_all_blogs_1.GetAllBlogsUseCase, get_target_blog_1.GetTargetBlogUseCase, create_blog_1.CreateBlogUseCase, update_blog_1.UpdateBlogUseCase, delete_single_blog_1.DeleteBlogUseCase];
const useCasesPosts = [get_all_posts_1.GetAllPostsUseCase, get_single_post_1.GetSinglePostUseCase, get_all_posts_specific_blog_1.GetAllPostsSpecificBlogUseCase, create_post_1.CreatePostUseCase, update_post_1.UpdatePostUseCase, delete_post_1.DeletePostUseCase, create_comment_for_specific_post_1.CreateCommentForSpecificPostUseCase, get_comments_by_postID_1.GetCommentByPostIdUseCase, like_dislike_for_post_1.LikeDislikeForPostUseCase];
const useCasesComments = [Get_comment_by_id_1.GetCommentUseCase, Delete_comment_by_id_1.DeleteCommentUseCase, Update_Comment_By_Comment_Id_1.UpdateCommentUseCase, Like_dislike_for_comment_1.LikeDislikeCommentUseCase];
const useCasesDevices = [Get_all_devices_1.GetAllDevicesUseCase, Terminate_all_session_1.TerminateAllSessionUseCase, Terminate_target_session_by_id_1.TerminateSessionByIdUseCase, Found_user_by_device_id_1.FoundUserByDeviceIdUseCase];
const useCasesByBloggers = [create_blog_2.CreateBlogByBloggerUseCase, get_all_blogs_3.GetAllBlogsforBloggerUseCase, delete_single_blog_2.DeleteBlogForSpecificBloggerUseCase, update_blog_2.UpdateBlogByBloggerUseCase, create_Post_1.CreatePostByBloggerUseCase, delete_post_by_id_1.DeletePostByBloggerUseCase];
const useCasesSuperAdminBlogs = [get_all_blogs_2.GetAllBlogsSuperAdminUseCase, binding_blog_1.BindingBlogSuperAdminUseCase];
const useCasesSuperAdminUsers = [create_user_SA_1.CreateUserSAUseCase, check_banStatus_1.CheckBanStatusSuperAdminUseCase, get_all_user_SA_1.GetAllUsersAsSuperAdminUseCase, delete_user_SA_1.DeleteUserAsSuperAdminUseCase, ban_user_SA_1.BanUserAsSuperAdminUseCase];
const useCasesUsers = [Get_user_by_id_1.GetUserByUserIdUseCase];
const UtilityUseCase = [check_forbidden_1.CheckForbiddenUseCase];
const blogsProviders = [blogs_service_1.BlogsService,];
const postsProviders = [posts_service_1.PostsService];
const commentsProviders = [comments_service_1.CommentsService, comments_repository_1.CommentsRepository,];
const usersProviders = [users_service_1.UsersService, users_repository_1.UsersRepository,];
const blogsByBloggersProviders = [bloggers_repository_1.BlogsByBloggerRepository];
const emailProviders = [email_service_1.EmailService, email_manager_1.EmailManager, email_adapter_1.EmailAdapter,];
const authProviders = [auth_service_1.AuthService,];
const securityDevicesProviders = [security_service_1.SecurityDeviceService, security_repository_1.SecurityDeviceRepository,];
const blogsSuperAdminProviders = [blogs_SA_repository_1.BlogsSuperAdminRepository,];
const usersSuperAdminProviders = [SuperAdmin_user_repository_1.SuperAdminUsersRepository,];
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (config) => ({
                    transport: {
                        host: config.get('EMAIL_HOST'),
                        secure: false,
                        port: 587,
                        auth: {
                            user: config.get('EMAIL_USER'),
                            pass: config.get('PASSWORD_GMAIL')
                        },
                    },
                }), inject: [config_1.ConfigService]
            }),
            typeorm_1.TypeOrmModule.forRoot({
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
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env'
            }),
            mongoose_1.MongooseModule.forRoot(uri, options),
            mongoose_1.MongooseModule.forFeature([
                { name: 'Blogs', schema: db_1.blogsSchema },
                { name: 'Posts', schema: db_1.postSchema },
                { name: 'Comments', schema: db_1.commentsSchema },
                { name: 'Users', schema: db_1.usersSchema },
                { name: 'RefreshToken', schema: db_1.refreshTokenSchema },
                { name: 'RegistrationData', schema: db_1.registrationDataSchema },
                { name: 'AuthData', schema: db_1.authDataSchema },
                { name: 'CodeConfirm', schema: db_1.codeConfirmSchema },
                { name: 'EmailSend', schema: db_1.emailSendSchema },
                { name: 'RecoveryPassword', schema: db_1.recoveryPasswordSchema },
                { name: 'NewPassword', schema: db_1.newPasswordSchema }
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '24h'
                }
            }), cqrs_1.CqrsModule
        ],
        controllers: [app_controller_1.AppController, blogs_controller_1.BlogsController, posts_controller_1.PostController, users_controller_1.UsersController, auth_controller_1.AuthController, comments_controller_1.CommentsController, full_delete_controller_1.FullDataController, security_controller_1.SecurityDeviceController, bloggers_controller_1.BloggersController, sa_blog_controller_1.SuperAdminBlogsController, sa_users_controller_1.SuperAdminUsersController],
        providers: [app_service_1.AppService,
            { provide: blogs_repository_1.BlogsRepository, useClass: process.env.USE_DATABASE === 'SQL' ? blogs_sql_repository_1.BlogsRepositorySql : blogs_repository_1.BlogsRepository },
            { provide: posts_repository_1.PostRepository, useClass: process.env.USE_DATABASE === 'SQL' ? posts_sql_repository_1.PostsRepositorySql : posts_repository_1.PostRepository },
            jwt_service_1.JwtServiceClass, full_delete_module_1.FullDeleteModule, validator_posts_form_1.BlogIsExistRule,
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
], AppModule);
//# sourceMappingURL=app.module.js.map