import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {UserModule} from "./user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import dbconfig from "./dbconfig";


@Module({
  imports: [TypeOrmModule.forRoot(dbconfig), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
