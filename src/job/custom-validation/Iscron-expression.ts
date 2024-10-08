import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import * as cronParser from 'cron-parser';

export function IsCronExpression(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCronExpression',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          try {
            cronParser.parseExpression(value);
            return true; 
          } catch {
            return false; 
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${propertyName} must be a valid cron expression`;
        },
      },
    });
  };
}
