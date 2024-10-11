import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersRepository } from "src/users/repositories/users.repository";




  @Injectable()
  export class UserRegistrationFlow implements CanActivate {
    constructor(
      public usersRepository: UsersRepository, 
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> | null {
      const request = context.switchToHttp().getRequest();
      const login = request.body.login;
      const email = request.body.email;
      const code = request.body.code
      const userWithExistingEmail = await this.usersRepository.findUserByEmail(email);
      const userWithExistingLogin = await this.usersRepository.findUserByLogin(login);      
      
      if (userWithExistingEmail) {
        const errorResponseForEmail = {
          errorsMessages: [
            {
              message: 'email already exist',
              field: "email",
            }
          ]
      }
        throw new BadRequestException(errorResponseForEmail)
      }
      else if (userWithExistingLogin) {
        const errorResponseForLogin = {
          errorsMessages: [
            {
              message: 'login already exist',
              field: "login",
            }
          ]
      }          
        throw new BadRequestException(errorResponseForLogin);
      }
      else { 
        return true;
      }  
      
    }
  } 