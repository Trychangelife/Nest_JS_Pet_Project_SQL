import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const res: any = exception.getResponse()
  
    if (status === 400 && res.errorsMessages) {
      const errorResponse = {
        errorsMessages: res.errorsMessages,
      }
      response.status(status).json(errorResponse) 
    }
    else if (status === 400 && res.message) {
      const errorResponse = {
        errorsMessages: [],
      }
      typeof res.message !== 'string' && res.message.forEach(m => {
        errorResponse.errorsMessages.push(m)
      })
      response.status(status).json(errorResponse)
    }
    else if (status === 400 && request.body.recoveryCode === "incorrect") {
      response.status(status).json({ errorsMessages: [{ message: request.body.recoveryCode, field: "recoveryCode" }] })
    }
    // else if (typeof (request.body.likesInfo.dislikesCount) === "number") {
    //   response.status(status).json({ errorsMessages: [{ message: "passes body incorrect", field: "likeStatus" }] })
    // }
    else {
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

