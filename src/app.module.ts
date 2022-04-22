import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from "./user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import dbconfig from "./dbconfig";
import {AuthMiddleware} from "./user/middleware/auth.middleware";


@Module({
  imports: [TypeOrmModule.forRoot(dbconfig), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(AuthMiddleware)
        .forRoutes(
            {path:'users/:id', method: RequestMethod.PUT},
                  {path:'users/:id', method: RequestMethod.DELETE}
        );
  }
}
