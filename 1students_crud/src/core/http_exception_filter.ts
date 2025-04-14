// import {
//   ExceptionFilter,
//   HttpException,
//   ArgumentsHost,
//   Catch,
//   Logger,
//   ConsoleLogger,
// } from '@nestjs/common';

// import { Request, Response } from 'express';

// @Catch(HttpException)
// export class HttpExceptionFilter implements ExceptionFilter {
//   catch(exception: HttpException, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();
//     const status = exception.getStatus();

//     const errorResponse = {
//       statusCode: status,
//       message: exception.message,
//     };

//     Logger.error(
//       `${request.method} ${request.url}`,
//       exception.stack,
//       'HttpExceptionFilter',
//     );

//     response.status(status).json(errorResponse);
//   }
// }
