import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async registerUser(createUserDto: CreateUserDto): Promise<User> {
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
        return await this.userRepository.save(newUser)
    }
}
