import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AccountUserDataEntity } from "src/entities/auth/account_user_data.entity";
import { NewPasswordEntity } from "src/entities/auth/new_password.entity";
import { RefreshTokenStorageEntity } from "src/entities/auth/refresh_token_storage.entity";
import { BlogEntity } from "src/entities/blog/blog.entity";
import { CommentEntity } from "src/entities/comment/comment.entity";
import { CommentDislikeStorageEntity } from "src/entities/comment/comment_dislike_storage.entity";
import { CommentLikeStorageEntity } from "src/entities/comment/comment_like_storage.entity";
import { EmailConfirmationEntity } from "src/entities/email/email_confirmation.entity";
import { EmailSendDataEntity } from "src/entities/email/email_send_data.entity";
import { PostEntity } from "src/entities/posts/posts.entity";
import { PostsDislikeStorageEntity } from "src/entities/posts/posts_dislike_storage.entity";
import { PostsLikeStorageEntity } from "src/entities/posts/posts_like_storage.entity";
import { BanInfoEntity } from "src/entities/users/ban_info.entity";
import { RecoveryPasswordEntity } from "src/entities/users/recovery_password.entity";
import { RecoveryPasswordInfoEntity } from "src/entities/users/recovery_password_info.entity";
import { UserEntity } from "src/entities/users/user.entity";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { JwtServiceClass } from "src/guards/jwt.service";
import { RateLimitGuard } from "src/guards/rate-limit.guard";
import { BlogIsExistRule } from "src/posts/validator.posts.form";
import { UsersModule } from "src/users/users.module";

@Global()
@Module({
    imports: [UsersModule,
        CacheModule.register({
        ttl: 10000,
        max: 10
      }), JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: '24h'
        },
        
    }), CqrsModule,
    TypeOrmModule.forFeature([
        UserEntity,
        RefreshTokenStorageEntity,
        PostEntity,
        BlogEntity,
        CommentEntity,
        CommentLikeStorageEntity,
        CommentDislikeStorageEntity,
        AccountUserDataEntity,
        EmailConfirmationEntity,
        EmailSendDataEntity,
        NewPasswordEntity,
        PostsLikeStorageEntity,
        PostsDislikeStorageEntity,
        RecoveryPasswordEntity,
        RecoveryPasswordInfoEntity,
        BanInfoEntity,
        
      ])
],
    providers: [JwtServiceClass, JwtService, JwtAuthGuard, RateLimitGuard, BlogIsExistRule],
    exports: [JwtServiceClass, JwtService, JwtAuthGuard, RateLimitGuard, CacheModule, JwtModule, BlogIsExistRule]
})

export class GlobalModule {}