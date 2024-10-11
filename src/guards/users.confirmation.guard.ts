import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersRepository } from "src/users/repositories/users.repository";




  @Injectable()
  export class UserConfirmationFlow implements CanActivate {
    constructor(
      public usersRepository: UsersRepository, 
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> | null {
      const request = context.switchToHttp().getRequest();
      const code = request.body.code
      try {
        const user = await this.usersRepository.findUserByConfirmationCode(code)
        if (user) {
          const errorResponseForLogin = {errorsMessages: [{message: 'account already confirmed',field: "code",}]}          
          throw new BadRequestException(errorResponseForLogin);} 
        else {
          return true;
        }  
      } catch (error) {
        return true
      }
    }
  } 