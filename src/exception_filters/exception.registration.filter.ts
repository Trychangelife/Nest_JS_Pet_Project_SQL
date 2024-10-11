// import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
// import { Request, Response } from 'express';
// // import { EntityNotFoundError } from 'wherever';

// @Catch(EntityNotFoundError)
// export class EntityNotFoundExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();

//     response
//       .status(status)
//       .json({
//         "statusCode": 400,
//         "error": "Bad Request",
//         "message": [
//           {
//             "target": {},
//             "property": "email",
//             "children": [],
//             "constraints": {
//               "isEmail": "email must be an email"
//             }
//           },
//           // other field exceptions
//         ]
//       });
//   }
// }