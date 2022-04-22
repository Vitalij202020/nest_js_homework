import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from "./dto/createUser.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./user.entity";
import {Repository} from "typeorm";
import {JWT_SECRET} from "../config";
import {sign} from "jsonwebtoken";
import {LoginUserDto} from "./dto/loginUser.dto";
import {compare} from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async getOneUser(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({id});
        if (!user) {
            throw new HttpException('User Not Found!', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return user
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({
            email: createUserDto.email,
        });
        if (userByEmail) {
            throw new HttpException('Email is taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto);
        return await this.userRepository.save(newUser);
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userRepository.findOne({
            email: loginUserDto.email,
        },
            {select:['id', 'username', 'email',  'password']})
        if (!user) {
            throw new HttpException(
                'Credentials are not valid',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        const isPasswordCorrect = await compare(
            loginUserDto.password,
            user.password,
        );

        if (!isPasswordCorrect) {
            throw new HttpException(
                'Credentials are not valid',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        delete user.password;
        return user;
    }

    async updateUser(id: number, updateUserDto: CreateUserDto): Promise<string> {
        const userExists = await this.findById(id)
        if (!userExists) {
            throw new HttpException('User Not Exists!', HttpStatus.UNPROCESSABLE_ENTITY);
        }

        const userByEmail = await this.userRepository.findOne({
            email: updateUserDto.email,
        });
        if (userByEmail) {
            throw new HttpException('Email is taken', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        Object.assign(userExists, updateUserDto);
        const result = await this.userRepository.save(userExists);
        if (!result) {
            throw new HttpException('Some undefined error', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return `User with email - ${userExists.email} successfully updated!`
    }

    async deleteUser(id: number): Promise<string> {
        const {affected} = await this.userRepository.delete({id});
        if (!affected) {
            throw new HttpException('User Not Found', HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return `User with id - ${id} successfully deleted!`;
    }

    async findById(id: number): Promise<UserEntity> {
        return await this.userRepository.findOne(id);
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
}