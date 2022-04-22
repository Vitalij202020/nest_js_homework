import {IsEmail, IsNotEmpty, Length,} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @Length(2, 30)
    readonly username: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;


    @IsNotEmpty()
    @Length(5, 15)
    readonly password: string;
}