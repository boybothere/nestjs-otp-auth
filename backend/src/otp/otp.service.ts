import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './entities/otp.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { OTPType } from './types/OTP.type';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OtpService {
    constructor(@InjectRepository(OTP) private readonly OTPRepository: Repository<OTP>) { }

    async generateOTP(user: User, type: OTPType): Promise<string> {
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);

        const now = new Date();
        const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

        const newOtp = this.OTPRepository.create({
            user,
            token: hashedOTP,
            type,
            expiresAt
        })
        await this.OTPRepository.save(newOtp)
        return otp
    }
}
