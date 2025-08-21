import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { OtpModule } from 'src/otp/otp.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OtpModule, EmailModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
