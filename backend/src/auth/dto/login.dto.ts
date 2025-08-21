import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LoginDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNumber()
    @IsNotEmpty()
    otp: string;
}