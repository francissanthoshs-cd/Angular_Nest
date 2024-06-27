import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

const ormOptions: TypeOrmModuleOptions = {
  host: 'localhost', port: 3306, type: 'mysql', username: 'root', password: '', database: 'nestjs',
  autoLoadEntities: true, synchronize: true// Not recommended for production
}

@Module({
  //importing the DB Connection
  imports: [TodoModule, TypeOrmModule.forRoot(ormOptions), AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
