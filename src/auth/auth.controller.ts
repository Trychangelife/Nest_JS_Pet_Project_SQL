import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Request, Res, UseFilters, UseGuards } from "@nestjs/common";
import { AuthForm } from "src/auth/dto/AuthForm_validator";
import { EmailService } from "src/email/email.service";
import { HttpExceptionFilter } from "src/exception_filters/exception_filter";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { JwtServiceClass } from "src/guards/jwt.service";
import { RateLimitGuard } from "src/guards/rate-limit.guard";
import { UserRegistrationFlow } from "src/guards/users.registration.guard";
import { UsersService } from "src/users/application/users.service";
import { UsersType, userViewModel } from "src/users/dto/UsersType";
import { UsersRepository } from "src/users/repositories/users.repository";
import { isUuid } from "uuidv4";
import { AuthService } from "./application/auth.service";
import { EmailForRecoveryPassword } from "./dto/EmailForRecoveryPassword_Validator";
import { NewPassword } from "./dto/NewPassword_Validator";


@Controller('auth')
export class AuthController {

    constructor(
        protected usersRepository: UsersRepository,
        protected usersService: UsersService,
        protected authService: AuthService,
        protected emailService: EmailService,
        protected jwtService: JwtServiceClass,) {
    }

    
    @Post('login')
    @UseGuards(RateLimitGuard)
    async authorization(@Request() req, @Body() DataUser: AuthForm, @Res() res) {
        //await this.authService.informationAboutAuth(req.ip, DataUser.loginOrEmail);
        const ip = req.ip
        const userAgent = req.headers['user-agent']
        //const checkIP = await this.authService.counterAttemptAuth(req.ip, DataUser.loginOrEmail);
        const checkIP = true 
        if (checkIP) {
            const user = await this.usersService.checkCredentials(DataUser.loginOrEmail, DataUser.password);
            const foundUser = await this.usersRepository.findUserByLogin(DataUser.loginOrEmail);
            if (!user || foundUser?.banInfo?.isBanned == true) {
                throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED)
            }
            else if (foundUser && user) {
                const accessToken = await this.jwtService.accessToken(foundUser);
                const refreshToken = await this.jwtService.getFirstRefreshToken(foundUser, ip, userAgent);
                res
                    .cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        secure: true//process.env.NODE_ENV === "production"
                    })
                    .status(200)
                    .send({ accessToken });
            }
            else {
                throw new HttpException("Something wrong", HttpStatus.BAD_REQUEST);
            }
        }
        else {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS);
        }
    }
    @Post('refresh-token')
    async updateAccessToken(@Req() req, @Res() res) {
        const refreshToken = req.cookies["refreshToken"];
        const ip = req.ip
        const aboutDevice = req.headers['user-agent']
        if (!refreshToken) {
            throw new HttpException('Refresh token not found, where you cookie?', HttpStatus.UNAUTHORIZED)
        }
        else if (refreshToken) {
            const newAccessToken: any = await this.jwtService.getNewAccessToken(refreshToken, ip, aboutDevice);
            if (newAccessToken !== null) {
                res
                    .cookie("refreshToken", newAccessToken.newRefreshToken, {
                        httpOnly: true,
                        secure: true//process.env.NODE_ENV === "production"
                    })
                    .status(200)
                    .send({ accessToken: newAccessToken.newAccessToken });
            }
            else {
                throw new HttpException('Refresh Token already not valid, repeat authorization', HttpStatus.UNAUTHORIZED)
            }
        }
        else {
            throw new HttpException("Something wrong", HttpStatus.BAD_REQUEST)
        }
    }

    
    @Post('registration')
    @UseGuards(RateLimitGuard)
    @UseGuards(UserRegistrationFlow)
    @UseFilters(new HttpExceptionFilter())
    //@UsePipes(new ValidationPipe())
    async registration(@Body() user: AuthForm, @Request() req: { ip: string }, @Res() res) {
        const result: userViewModel | null | boolean = await this.usersService.createUser(user.password, user.login, user.email, req.ip);
        if (result == false) {
            throw new HttpException("", HttpStatus.BAD_REQUEST)

            //res.status(400).json({ errorsMessages:  [{ message: "Login or email already use", field: `${user.email}` }] });
        }
        else if (result == null) {
            throw new HttpException("Something with data provided ", HttpStatus.BAD_REQUEST)
        }
        else {
            res
                .status(204)
                .send(result)
        }
    }
    @Post('registration-confirmation')
    @UseGuards(RateLimitGuard)
    async registrationConfirmation(@Body() body: { code: string }, @Request() req: { ip: string }, @Res() res) {
        if (!isUuid(body.code)) {
            const errorResponseForConfirmAccount = { errorsMessages: [{ message: 'account already confirmed', field: "code", }] }
                throw new HttpException(errorResponseForConfirmAccount, HttpStatus.BAD_REQUEST)
        }
        //const checkInputCode = await this.authService.counterAttemptConfirm(req.ip, body.code);
        const checkInputCode = true
        if (checkInputCode) {
            const activationResult = await this.usersService.confirmationEmail(body.code);
            if (activationResult) {
                res.status(204).send(checkInputCode)
            }
            else {
                const errorResponseForConfirmAccount = { errorsMessages: [{ message: 'account already confirmed', field: "code", }] }
                throw new HttpException(errorResponseForConfirmAccount, HttpStatus.BAD_REQUEST)
            }
        }
        else {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS)
        }
    }
    @Post('registration-email-resending')
    @UseGuards(RateLimitGuard)
    async registrationEmailResending(@Body() user: { id: number, password: string, login: string, email: string }, @Request() req: { ip: string }) {
        //await this.authService.informationAboutEmailSend(req.ip, user.email);
        //const checkAttemptEmail = await this.authService.counterAttemptEmail(req.ip, user.email);
        const checkAttemptEmail = true
        if (checkAttemptEmail) {
            await this.authService.refreshActivationCode(user.email);
            const emailResending = await this.emailService.emailConfirmation(user.email);
            //const emailResending = true

            //ЗАКОММЕНТИРОВАЛ ЧТОБЫ НЕ ОТПРАВЛЯТЬ ПИСЬМА ПРОСТО ТАК
            if (emailResending) {
                throw new HttpException("Email send succefully", HttpStatus.NO_CONTENT);
            }
            else {
                const errorResponseForConfirmAccount = { errorsMessages: [{ message: 'account already confirmed', field: "email", }] }
                throw new HttpException(errorResponseForConfirmAccount, HttpStatus.BAD_REQUEST)
            }
        }
        else {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS)
        }
    }
    @Post('logout')
    async logout(@Req() req) {
        const refreshTokenInCookie = req.cookies.refreshToken;
        const checkRefreshToken = await this.jwtService.checkRefreshToken(refreshTokenInCookie);
        const findTokenInData = await this.jwtService.findTokenInData(refreshTokenInCookie);
        if (refreshTokenInCookie && checkRefreshToken !== false && findTokenInData !== null) {
            await this.jwtService.deleteTokenFromData(refreshTokenInCookie);
            throw new HttpException("Logout successfully, bye!", HttpStatus.NO_CONTENT);
        } else {
            throw new HttpException("Sorry, you already logged out, please re-authenticate", HttpStatus.UNAUTHORIZED);
        }
    }
    
    // If the inputModel has invalid email (for example 222^gmail.com)
    @UseFilters(new HttpExceptionFilter())
    @Post('password-recovery')
    async passwordRecovery(@Req() req, @Body() user: EmailForRecoveryPassword) {
        //await this.authService.informationAboutRecoveryPassword(req.ip, user.email);
        //const checkAttemptRecoveryPassword = await this.authService.counterAttemptRecoveryPassword(req.ip, user.email);
        const checkAttemptRecoveryPassword = true
        if (checkAttemptRecoveryPassword) {
            const createRecoveryPassword = await this.usersService.passwordRecovery(user.email)
            // 	Even if current email is not registered (for prevent user's email detection)
            if (createRecoveryPassword) {
                await this.emailService.emailPasswordRecovery(user.email)
                throw new HttpException("Just 204", HttpStatus.NO_CONTENT)
            }
            else {
                throw new HttpException("Just 204", HttpStatus.NO_CONTENT)
            }
        }
        else {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS)
        }
    }
    @UseFilters(new HttpExceptionFilter())
    @Post('new-password')
    async newPassword(@Req() req, @Body() newPasswordEntity: NewPassword) {
        // Регистрируем обращение на наш эндпоинт 
        //await this.authService.informationAboutNewPassword(req.ip, newPasswordEntity.recoveryCode);
        // Проверяем наличие 5 и более обращений за последних 10 секунд (для 429 ошибки)
        //const checkAttemptNewPassword = await this.authService.counterAttemptNewPassword(req.ip, newPasswordEntity.recoveryCode);
        // True возвращается - значит все хорошо, пользователь нам не спамит
        const checkAttemptNewPassword = true
        if (checkAttemptNewPassword) {
            // Тут нужно реализовать создание нового пароля для юзера
            const result = await this.usersService.createNewPassword(newPasswordEntity.newPassword, newPasswordEntity.recoveryCode)
            if (result) {
                throw new HttpException("Just 204", HttpStatus.NO_CONTENT)
            }
            else {
                throw new HttpException(`{ errorsMessages: [{ message: Any<String>, field: "${newPasswordEntity.recoveryCode}" }] }`, HttpStatus.BAD_REQUEST)
            }
        }
        else {
            throw new HttpException("To many requests", HttpStatus.TOO_MANY_REQUESTS)
        }
    }
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async aboutMe(@Request() req) {
        const foundUser = await this.usersRepository.findUserByLoginForAboutMe(req.user.login);
        return foundUser
    }
    @Get('get-confirm-date')
    async getConfirmDate() {
        const confrimData = await this.usersRepository.getConfirmAttemptDate();
        return confrimData;
    }
    @Get('get-email-date')
    async getEmailDate() {
        const emailSendData = await this.usersRepository.getEmailSendDate();
        return emailSendData;
    }
    @Get('get-token-date')
    async getTokenDate() {
        const TokenData = await this.usersRepository.getTokenDate();
        return TokenData;
    }
}
