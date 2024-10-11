import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { stat } from 'fs';

@Catch(HttpException)
export class HttpExceptionFilterForLikes implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const res: any = exception.getResponse()
    
    if (status === 400) {
        //У нас в нашем случае только одно поле которое принимает эндпоинт - поэтому кроме likeStatus там полей нет.
        response.status(status).json({ errorsMessages: [{ message: "passes body incorrect", field: "likeStatus" }] })
    }
    else {
        //Если ошибка не 400, то нужно вернуть корректный статус например 404
        response.status(status).send()
    }
}
}










// import { Catch, ArgumentsHost, HttpException, Injectable } from '@nestjs/common';
// import { BaseExceptionFilter } from '@nestjs/core';

// @Injectable()
// @Catch()
// export class ValidationExceptionFilter extends BaseExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     const request = ctx.getRequest();

//     if (exception.getStatus() === 400) {
//       // Обрабатываем только ошибки 400 Bad Request
//       const errorResponse = exception.getResponse();
//       const validationErrors = errorResponse['message'];
//       // Получаем доступ к значениям валидации
//       const errorsMessages = validationErrors.map(error => ({
//         //message: error.message,
        
//         message: error.value, // Получаем значение поля из message.value
//         field: error.property,
//       }));
//       console.log(errorsMessages)
//       const errorResponseForLogin = {errorsMessages}
//       // Возвращаем кастомный объект ошибки без свойств error и statusCode
//       response.status(400).json(errorResponseForLogin );
//     } else {
//       // Если это не ошибка 400 Bad Request, вызываем стандартный обработчик ошибок
//       super.catch(exception, host);
//     }
//   }
// }


// import { ExceptionFilter, Catch, ArgumentsHost, HttpException, NotFoundException, HttpStatus, Injectable, ValidationError } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
    
//     catch(exception: HttpException, host: ArgumentsHost) {
//         const ctx = host.switchToHttp();
//         const response = ctx.getResponse<Response>();
//         console.log(exception.getResponse())
//         const request = ctx.getRequest<Request>();
//         const status = exception.getStatus
//             ? exception.getStatus()
//             : HttpStatus.INTERNAL_SERVER_ERROR;
//         const validationErrors = exception.getResponse() as ValidationError[]

//         if (status === 400) {
//             response.status(status).send({
//                 errorsMessages: [
//                     {
//                         message: validationErrors,
//                         field: validationErrors
//                     }
//                 ]
//             },);

//         }
//         else if (status === 401) {
//             response.status(status).json({ message: "check input data or JWT Token" })
//         }
//         else {
//             response
//                 .status(status)
//                 .json({
//                     statusCode: status,
//                     timestamp: new Date().toISOString(),
//                     path: request.url,
//                 });
//         }
//     }
// }

