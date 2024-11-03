import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { JwtServiceClass } from "src/guards/jwt.service";
import { RateLimitGuard } from "src/guards/rate-limit.guard";
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
        
    })],
    providers: [JwtServiceClass, JwtService, JwtAuthGuard, RateLimitGuard],
    exports: [JwtServiceClass, JwtService, JwtAuthGuard, RateLimitGuard, CacheModule, JwtModule]
})

export class GlobalModule {}