import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(field: string, message: string) {
    super({field: field, message: message}, HttpStatus.BAD_REQUEST);
  }
}