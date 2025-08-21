import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService
    ) { }
    async login(loginDto: LoginDto) {
        try {
            const { email, password, otp } = loginDto
            const user = await this.userRepository.findOne({
                where: { email }
            })
            if (!user) throw new UnauthorizedException("Email does not exist!")
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) throw new UnauthorizedException('Invalid credentials!');

            if (user.accountStatus === 'unverified') {
                if (!otp) {
                    return {
                        message: "Account is not verified, please provide your OTP to verify!"
                    }
                } else {
                    await this.verifyToken(user.id, otp);
                }
            }
            const payload = {
                sub: user.id,
                email: user.email
            }
            const accessToken = this.jwtService.sign(payload);
            return {
                accessToken,
                userId: user.id,
                email: user.email
            }

        } catch (err) {
            throw new BadRequestException("Login failed! Enter proper credentials!");
        }
    }

    async verifyToken(userId: number, token: string): Promise<User> {
        await this.otpService.validateOTP(userId, token);
        const user = await this.userRepository.findOne({
            where: { id: userId }
        })

        if (!user) throw new UnauthorizedException('User not found!');

        user.accountStatus = 'verified';
        return await this.userRepository.save(user);
    }
}
