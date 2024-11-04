import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule, JwtService } from "@nestjs/jwt";
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
        
    }), CqrsModule],
    providers: [JwtServiceClass, JwtService, JwtAuthGuard, RateLimitGuard, BlogIsExistRule],
    exports: [JwtServiceClass, JwtService, JwtAuthGuard, RateLimitGuard, CacheModule, JwtModule, BlogIsExistRule]
})

export class GlobalModule {}