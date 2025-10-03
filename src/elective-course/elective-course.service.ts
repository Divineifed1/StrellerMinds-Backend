import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectiveCourse } from './entities/elective-course.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { CreateElectiveCourseDto } from './dto/create-elective-course.dto';
import { UpdateElectiveCourseDto } from './dto/update-elective-course.dto';

@Injectable()
export class ElectiveCourseService {
  constructor(
    @InjectRepository(ElectiveCourse)
    private readonly electiveCourseRepository: Repository<ElectiveCourse>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  // ✅ REPORTING
  async getReport() {
    // total courses
    const totalCourses = await this.electiveCourseRepository.count();

    // active vs inactive
    const activeCourses = await this.electiveCourseRepository.count({
      where: { isActive: true },
    });
    const inactiveCourses = totalCourses - activeCourses;

    // enrollments per course
    const enrollmentsPerCourse = await this.enrollmentRepo
      .createQueryBuilder('enrollment')
      .select('enrollment.courseId', 'courseId')
      .addSelect('COUNT(enrollment.id)', 'enrollments')
      .groupBy('enrollment.courseId')
      .getRawMany();

    // attach course names
    const courses = await this.electiveCourseRepository.find();
    const enrollmentsWithNames = courses.map((c) => {
      const found = enrollmentsPerCourse.find((e) => e.courseId == c.id);
      return {
        courseId: c.id,
        courseName: c.title, // assuming `title` is the field
        enrollments: found ? Number(found.enrollments) : 0,
      };
    });

    // total enrollments overall
    const totalEnrollments = enrollmentsWithNames.reduce(
      (sum, c) => sum + c.enrollments,
      0,
    );

    // most & least popular
    const mostPopular = enrollmentsWithNames.reduce(
      (max, c) => (c.enrollments > max.enrollments ? c : max),
      { enrollments: -1 } as any,
    );
    const leastPopular = enrollmentsWithNames.reduce(
      (min, c) => (c.enrollments < min.enrollments ? c : min),
      { enrollments: Infinity } as any,
    );

    return {
      totalCourses,
      totalEnrollments,
      enrollmentsPerCourse: enrollmentsWithNames,
      mostPopular,
      leastPopular,
      activeCourses,
      inactiveCourses,
    };
  }

  // ✅ CRUD

  async createCourse(dto: CreateElectiveCourseDto): Promise<ElectiveCourse> {
    if (!dto.title || dto.title.trim().length === 0) {
      throw new BadRequestException('Title is required');
    }
    if (dto.creditHours == null || dto.creditHours <= 0) {
      throw new BadRequestException('creditHours must be greater than 0');
    }
    const entity = this.electiveCourseRepository.create(dto);
    return await this.electiveCourseRepository.save(entity);
  }

  async getAllCourses(): Promise<ElectiveCourse[]> {
    return await this.electiveCourseRepository.find();
  }

  async getCourseById(id: string): Promise<ElectiveCourse> {
    const found = await this.electiveCourseRepository.findOne({
      where: { id },
    });
    if (!found) throw new NotFoundException('Elective course not found');
    return found;
  }

  async updateCourse(
    id: string,
    dto: UpdateElectiveCourseDto,
  ): Promise<ElectiveCourse> {
    const course = await this.getCourseById(id);

    if (dto.title !== undefined && dto.title.trim().length === 0) {
      throw new BadRequestException('Title cannot be empty');
    }
    if (dto.creditHours !== undefined && dto.creditHours <= 0) {
      throw new BadRequestException('creditHours must be greater than 0');
    }

    const updated = Object.assign(course, dto);
    return await this.electiveCourseRepository.save(updated);
  }

  async deleteCourse(id: string): Promise<void> {
    const result = await this.electiveCourseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Elective course not found');
    }
  }
};