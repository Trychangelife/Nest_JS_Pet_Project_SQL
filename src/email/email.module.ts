import { MailerModule } from "@nest-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EmailService } from "./email.service";
import { EmailManager } from "./email.manager";
import { EmailAdapter } from "./email.adapter";


@Module({
    imports: [MailerModule.forRootAsync({
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
      }),],
    controllers: [],
    providers: [EmailService, EmailManager, EmailAdapter,],
    exports: [MailerModule, EmailService, EmailManager, EmailAdapter,]
  })
  export class EmailModule {}