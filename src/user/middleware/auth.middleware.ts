import { JWT_SECRET } from '../../config';
import {HttpException, HttpStatus, Injectable, NestMiddleware} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';
import {ExpressRequest} from "../../types/expressRequest.interface";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {}

    async use(req: ExpressRequest, _: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            throw new HttpException('The user is not logged in, please sign up or login', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decode = verify(token, JWT_SECRET);
            next();
        } catch (err) {
            throw new HttpException('The user is not logged in, please sign up or login', HttpStatus.UNPROCESSABLE_ENTITY)
        }
    }
}
