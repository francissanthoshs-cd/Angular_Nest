/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entity/employee.entity';
import { Repository } from 'typeorm';
import { ContactInfo } from './entity/contact-info.entity';
import { Meeting } from './entity/meeting.entity';
import { Task } from './entity/task.entity';
import { throwIfEmpty } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Employee) private employeeRepo: Repository<Employee>,
    @InjectRepository(ContactInfo)
    private contactInfoRepo: Repository<ContactInfo>,
    @InjectRepository(Meeting) private meetinRepo: Repository<Meeting>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
  ) {}

  async seed() {
    //employee1 CEO
    const ceo = this.employeeRepo.create({ name: 'Mr.CEO' });
    await this.employeeRepo.save(ceo);

    const ceoContactInfo = this.contactInfoRepo.create({
      email: '123@gmail.com',
      // employeeId: ceo.id,
    });
    ceoContactInfo.employee = ceo;
    await this.contactInfoRepo.save(ceoContactInfo);

    //EMployee 2 manager
    const manager = this.employeeRepo.create({
      name: 'Marius',
      manager: ceo,
    });

    const task1 = this.taskRepo.create({ name: 'Hire People' });
    await this.taskRepo.save(task1);
    const task2 = this.taskRepo.create({ name: 'Finish Presentation' });
    await this.taskRepo.save(task2);
    manager.tasks = [task1, task2];
    const meeting1 = this.meetinRepo.create({ zoomUrl: 'meeting.com' });
    meeting1.attendees = [ceo];
    await this.meetinRepo.save(meeting1);
    manager.meetings = [meeting1];
    await this.employeeRepo.save(manager);
  }

  getEmployee(id: number) {
    // return this.employeeRepo.findOne({
    //   where: { id: id },
    //   relations: [
    //     'manager',
    //     'directReports',
    //     'tasks',
    //     'contactInfo',
    //     'meetings',
    //   ],
    // });
    return this.employeeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.directReports', 'directReports')
      .leftJoinAndSelect('employee.meetings', 'meetings')
      .leftJoinAndSelect('employee.tasks', 'tasks')
      .where('employee.id = :employeeId', { employeeId: id })
      .getOne();
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.contactInfoRepo.delete({ employeeId: id });
    await this.employeeRepo.delete(id);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
