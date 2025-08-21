import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { RequestTokenDto } from './dto/request-token.dto';
import { OTPType } from 'src/otp/types/OTP.type';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post('register')
    async registerUser(@Body() createUserDto: CreateUserDto) {
        await this.userService.registerUser(createUserDto)
        return { message: "User Registered successfully and email sent to registered email!" }
    }

    @Post('request-otp')
    async RequestOtp(@Body() requestTokenDto: RequestTokenDto) {
        const { email } = requestTokenDto;
        const user = await this.userService.validateEmail(email);
        await this.userService.emailVerification(user, OTPType.OTP)
        return {
            message: 'OTP sent successfully! Please check mail!'
        }
    }

}
