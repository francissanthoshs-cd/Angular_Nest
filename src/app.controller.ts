import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    return this.appService.seed();
    // return this.appService.getEmployee(1);
    // return this.appService.deleteEmployee(2);
  }
}
