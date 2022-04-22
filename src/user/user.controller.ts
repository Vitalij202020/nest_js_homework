import {Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/createUser.dto";
import {UserEntity} from "./user.entity";
import {LoginUserDto} from "./dto/loginUser.dto";


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers(): Promise<UserEntity[]> {
        return await this.userService.getAllUsers();
    }

    @Get('/:id')
    async getOneUser(@Param('id') id: string): Promise<UserEntity> {
        return await this.userService.getOneUser(+id);
    }

    @Post('')
    @UsePipes(new ValidationPipe())
    async createUser(
        @Body() createUserDto: CreateUserDto,
    ): Promise<any> {
        const user = await this.userService.createUser(createUserDto);
        return this.userService.generateJwt(user);
    }

    @Post('/login')
    @UsePipes(new ValidationPipe())
    async login(
        @Body() loginDto: LoginUserDto,
    ): Promise<any> {
        const user = await this.userService.login(loginDto);
        return this.userService.generateJwt(user);
    }

    @Put('/:id')
    @UsePipes(new ValidationPipe())
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: CreateUserDto
    ): Promise<string> {
        return await this.userService.updateUser(+id, updateUserDto);
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: string): Promise<any> {
        return await this.userService.deleteUser(+id);
    }
}