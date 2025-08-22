import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { OtpService } from 'src/otp/otp.service';
import { OTPType } from 'src/otp/types/OTP.type';;
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly OTPService: OtpService,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService
    ) { }

    async registerUser(createUserDto: CreateUserDto): Promise<void> {
        const { email, password } = createUserDto;
        const findUser = await this.userRepository.findOne({
            where: { email }
        })
        if (findUser) throw new BadRequestException({ message: "User already exists!" })
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await this.userRepository.create({
            email,
            password: hashedPassword
        })
        await this.userRepository.save(newUser)
    }

    async emailVerification(user: User, type: OTPType) {
        const token = await this.OTPService.generateToken(user, type)
        if (type === OTPType.OTP) {
            const emailDto = {
                recipients: [user.email],
                subject: "OTP for verification",
                html: `Your OTP is <strong>${token}</strong>.
            <br /> Use this to log into your account and do not share it!
            <br />If you did not request this, you can ignore this email`
            }
            return await this.emailService.sendEmail(emailDto)
        } else if (type === OTPType.RESET_LINK) {
            const reset_link = `${this.configService.get<string>('RESET_PASSWORD_URL')}?token=${token}`
            const emailDto = {
                recipients: [user.email],
                subject: "Password Reset Link",
                html: `Click the link to reset your password: <p><a href="${reset_link}">Reset Password</p>`
            }
            return await this.emailService.sendEmail(emailDto)
        }

    }

    async validateEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { email }
        })
        if (!user) throw new BadRequestException('Email does not exist!')
        return user;
    }
}
