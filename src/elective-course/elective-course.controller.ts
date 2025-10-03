import { Controller, Get } from '@nestjs/common';
import { ElectiveCourseService } from './elective-course.service';
@Controller('elective-courses')
export class ElectiveCourseController {
  constructor(private readonly courseService: ElectiveCourseService) {}

  @Get('report')
  async getReport() {
    return this.courseService.getReport();
  }
}
