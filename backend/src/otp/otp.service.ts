import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './entities/otp.entity';
import { MoreThan, Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { OTPType } from './types/OTP.type';
import { User } from 'src/user/entities/user.entity';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(OTP) private readonly OTPRepository: Repository<OTP>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async generateToken(user: User, type: OTPType): Promise<string> {
        if (type === OTPType.OTP) {
            const otp = crypto.randomInt(100000, 999999).toString();
            const hashedOTP = await bcrypt.hash(otp, 10);

            const now = new Date();
            const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

            const existingOtp = await this.OTPRepository.findOne({
                where: { user: { id: user.id }, type }
            })

            if (existingOtp) {
                existingOtp.token = hashedOTP
                existingOtp.expiresAt = expiresAt
                await this.OTPRepository.save(existingOtp)
            }

            if (!existingOtp) {
                const newOtp = this.OTPRepository.create({
                    user,
                    token: hashedOTP,
                    type,
                    expiresAt
                })
                await this.OTPRepository.save(newOtp)
            }
            return otp
        } else if (type === OTPType.RESET_LINK) {
            const reset_link = this.jwtService.sign(
                { sub: user.id, email: user.email },
                {
                    secret: this.configService.get<string>('JWT_RESET_SECRET'),
                    expiresIn: '15m'
                }
            )
            return reset_link;
        }
        throw new Error('Token could not be generated, try again.');
    }

    async validateOTP(userId: number, otp: string): Promise<boolean> {
        const validateToken = await this.OTPRepository.findOne({
            where: {
                user: { id: userId },
                expiresAt: MoreThan(new Date())
            }
        })
        if (!validateToken) throw new BadGatewayException('Your OTP has expired, please request a new one!');

        const tokenMatch = await bcrypt.compare(otp, validateToken.token);
        if (!tokenMatch) throw new BadRequestException('Please enter correct OTP!')
        return true;
    }

    async validateResetPassword(token: string) {
        try {
            const decodeToken = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_RESET_SECRET')
            })
            return decodeToken.sub
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new BadRequestException(
                    'The reset token has expired, please request a new one'
                )
            }
            throw new BadRequestException('Invalid token provided')
        }
    }
}
