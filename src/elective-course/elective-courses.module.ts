import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectiveCourseService } from './elective-course.service';
import { ElectiveCourseController } from './elective-course.controller';
import { ElectiveCourse } from './entities/elective-course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';

@Module({
  imports: [
    // ✅ Register entities for this module
    TypeOrmModule.forFeature([ElectiveCourse, Enrollment]),
  ],
  controllers: [ElectiveCourseController],
  providers: [ElectiveCourseService],
  exports: [ElectiveCourseService], // optional if other modules need it
})
export class ElectiveCoursesModule {}
