import {IsEmail, IsNotEmpty, Length} from "class-validator";

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @Length(5, 15)
    readonly password: string;
}