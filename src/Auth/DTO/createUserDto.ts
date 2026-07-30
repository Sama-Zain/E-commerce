import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { genderEnum, providerEnum, roleEnum } from 'src/common/enums/usersEnum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 20, { message: 'FirstName Must be between 2 and 20 characters' })
  @Transform(({ value }) => value?.trim())
  FirstName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 20, { message: 'LastName Must be between 2 and 20 characters' })
  @Transform(({ value }) => value?.trim())
  LastName!: string;

  @IsEmail({}, { message: ' Please Provide a valid email format' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100, { message: 'Password Must be between 6 and 100 characters' })
  @ValidateIf((dto: CreateUserDto) => dto.provider !== providerEnum.GOOGLE)
  password!: string;

  @IsEnum(genderEnum, {
    message: 'Gender value is not valid at gender Selection',
  })
  @IsOptional()
  gender!: string;

  @IsEnum(providerEnum, {
    message: 'Provider value is not valid at provider Selection',
  })
  @IsOptional()
  provider!: string;

  @IsEnum(roleEnum, { message: 'Role value is not valid at role Selection' })
  @IsOptional()
  role!: string;
}
