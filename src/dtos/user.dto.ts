import { Expose, Exclude } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, ValidateIf } from "class-validator";

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  password: string;
}

export class LoginUserDTO {
  @ValidateIf((obj) => !obj.username)
  @IsEmail()
  email: string;

  @ValidateIf((obj) => !obj.email)
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  password: string;
}

export class UserDTO {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  @IsString()
  password: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
