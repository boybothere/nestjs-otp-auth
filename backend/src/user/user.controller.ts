import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
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
        return { message: "User Registered successfully, please proceed to the login page!" }
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

    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: RequestTokenDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userService.validateEmail(email);
        if (!user) throw new NotFoundException('User email not found!');

        await this.userService.emailVerification(user, OTPType.RESET_LINK);
        return { message: "Password reset link has been sent, please check your mail" }
    }

}
