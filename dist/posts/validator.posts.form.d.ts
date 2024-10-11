import { CommandBus } from '@nestjs/cqrs';
import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
export declare function BlogIsExist(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
export declare class BlogIsExistRule implements ValidatorConstraintInterface {
    private commandBus;
    constructor(commandBus: CommandBus);
    validate(value: string): Promise<boolean>;
    defaultMessage(args: ValidationArguments): string;
}
