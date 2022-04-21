import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from "./dto/createUser.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {Repository} from "typeorm";
import {JWT_SECRET} from "../config";
import {sign} from "jsonwebtoken";
import {UserResponseInterface} from "./types/userResponse.interface";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    getAllUsers(): string {
        return 'All Users here';
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({
            email: createUserDto.email,
        });
        console.log("Service ----------- ", userByEmail)
        if (userByEmail) {
            throw new HttpException('Email is taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        console.log('Service-----------newUser ', newUser);
        return await this.userRepository.save(newUser);
    }

    async findById(id: number): Promise<UserEntity> {
        return this.userRepository.findOne(id);
    }

    generateJwt(user: UserEntity): string {
        return sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            JWT_SECRET,
        );
    }

    buildUserResponse(user: UserEntity): UserResponseInterface {
        return {
            user: {
                ...user,
                token: this.generateJwt(user),
            },
        };
    }
}