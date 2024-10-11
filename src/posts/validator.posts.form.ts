import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { BlogsService } from 'src/blogs/application/blogs.service';
import { GetTargetBlogCommand } from 'src/blogs/application/use-cases/get_target_blog';


export function BlogIsExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: BlogIsExistRule,
    });
  };
}

@ValidatorConstraint({ name: 'BlogIsExist', async: false })
@Injectable()
export class BlogIsExistRule implements ValidatorConstraintInterface {
  constructor(private commandBus: CommandBus) {}

  async validate(value: string) {
    try {
      const blog = await this.commandBus.execute(new GetTargetBlogCommand(value))
      if(blog) {
        return true
      } else return false
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}
