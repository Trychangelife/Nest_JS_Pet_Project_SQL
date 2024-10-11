import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class HttpExceptionFilterForLikes implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
