import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LoginDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsNumber()
    otp: string;
}