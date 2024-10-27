import { MailerService } from "@nest-modules/mailer";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class EmailAdapter {
  constructor(private mailerService: MailerService) {}

  async sendEmailConfirmation(email: string, message: string, subject: string): Promise<object> {
    try {

      const result = await this.mailerService.sendMail({
        from: 'Evgeniy <jenbka999@gmail.com>',
        to: email,
        subject: subject,
        html: message,
      });

      
      return result; // Возвращаем результат
    } catch (error) {
      throw new HttpException(
        `Ошибка работы почты: ${JSON.stringify(error)}`, // Используем error
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
