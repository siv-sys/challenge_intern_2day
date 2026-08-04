import {
  registerDecorator,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { containsProfileInfo, isCommonPassword } from '../../utils/password.util';

function IsNotCommonPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isNotCommonPassword',
      target: object.constructor,
      propertyName,
      options: {
        message: 'password is too common, choose a less predictable password',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          return typeof value === 'string' && !isCommonPassword(value);
        },
      },
    });
  };
}

function DoesNotContainProfileInfo(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'doesNotContainProfileInfo',
      target: object.constructor,
      propertyName,
      options: {
        message: 'password must not contain your email or name',
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          if (typeof value !== 'string') return false;
          const dto = args.object as RegisterDto;
          return !containsProfileInfo(value, { email: dto.email ?? '', name: dto.name ?? '' });
        },
      },
    });
  };
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  @MaxLength(100, { message: 'name must be at most 100 characters' })
  name!: string;

  @IsEmail({}, { message: 'must be a valid email' })
  @MaxLength(150, { message: 'email must be at most 150 characters' })
  email!: string;

  @IsString()
  @MinLength(12, { message: 'password must be at least 12 characters long' })
  @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
  @Matches(/[a-z]/, { message: 'password must contain at least one lowercase letter' })
  @Matches(/[0-9]/, { message: 'password must contain at least one digit' })
  @Matches(/[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]/, {
    message: 'password must contain at least one special character',
  })
  @Matches(/^\S+$/, { message: 'password must not contain whitespace' })
  @IsNotCommonPassword()
  @DoesNotContainProfileInfo()
  password!: string;
}
