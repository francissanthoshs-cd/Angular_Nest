import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Employee } from './entity/employee.entity';
import { ContactInfo } from './entity/contact-info.entity';
import { Meeting } from './entity/meeting.entity';
import { Task } from './entity/task.entity';

const ormOptions: TypeOrmModuleOptions = {
  host: 'localhost',
  port: 3306,
  type: 'mysql',
  username: 'root',
  password: '',
  database: 'sample',
  autoLoadEntities: true,
  synchronize: true,
};
@Module({
  imports: [
    TypeOrmModule.forRoot(ormOptions),
    TypeOrmModule.forFeature([Employee, ContactInfo, Meeting, Task]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
