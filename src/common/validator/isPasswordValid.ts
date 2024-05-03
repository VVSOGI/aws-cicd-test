import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isPasswordValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const hasNumber = /\d/.test(value);
          const hasLetter = /[a-zA-Z]/.test(value);
          return hasNumber && hasLetter;
        },
        defaultMessage() {
          return 'password must contain letter and numbers';
        },
      },
    });
  };
}
