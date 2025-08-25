import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class LoginDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5, { message: 'Password must be minimum of length 5' })
    password: string;

    @IsNotEmpty()
    @IsNumber()
    otp: string;
}