import { Expose, Exclude } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";
import { OmitType, PickType } from "@nestjs/swagger";

export class UserDTO {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @MinLength(3)
  @MaxLength(16)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
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

export class ChangePasswordUserDTO extends PickType(UserDTO, ["password"] as const) {}
export class CreateUserDTO extends OmitType(UserDTO, ["id", "createdAt", "updatedAt"]) {}
export class LoginUserDTO extends OmitType(UserDTO, ["id", "createdAt", "updatedAt"]) {
  @ValidateIf((obj) => !obj.username)
  email: string;
  @ValidateIf((obj) => !obj.email)
  username: string;
}
