"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const res = exception.getResponse();
        if (status === 400 && res.errorsMessages) {
            const errorResponse = {
                errorsMessages: res.errorsMessages,
            };
            response.status(status).json(errorResponse);
        }
        else if (status === 400 && res.message) {
            const errorResponse = {
                errorsMessages: [],
            };
            typeof res.message !== 'string' && res.message.forEach(m => {
                errorResponse.errorsMessages.push(m);
            });
            response.status(status).json(errorResponse);
        }
        else if (status === 400 && request.body.recoveryCode === "incorrect") {
            response.status(status).json({ errorsMessages: [{ message: request.body.recoveryCode, field: "recoveryCode" }] });
        }
        else {
            response.status(status).send();
        }
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
//# sourceMappingURL=exception_filter.js.map