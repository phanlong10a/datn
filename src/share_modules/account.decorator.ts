import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isPhoneNumber,
  isEmail,
} from 'class-validator';

@ValidatorConstraint()
export class IsPhoneOrEmailConstraint implements ValidatorConstraintInterface {
  validate(userName: string) {
    const text = userName.trim().replace(new RegExp(' ', 'g'), '');
    const validCharsEmail = text.match(/[0-9a-zA-Z.@]/g)?.join('');
    return (
      IsPhoneOrEmailConstraint.isValidPhone(text) ||
      (isEmail(text) && text === validCharsEmail)
    );
  }

  static isValidPhone(text: string) {
    const validCharsPhone = text.match(/[0-9+-]/g)?.join('');
    return isPhoneNumber(text, 'VN') && validCharsPhone == text;
  }
}

export function IsPhoneOrEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneOrEmailConstraint,
    });
  };
}
