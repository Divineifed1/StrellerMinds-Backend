import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { OneToMany } from 'typeorm';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
@Entity('elective_courses')
export class ElectiveCourse {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({ type: 'varchar', length: 255 })
  title: string | undefined;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'int' })
  creditHours: number | undefined;

  @CreateDateColumn()
  createdAt: Date | undefined;


  @Column()
  name: string | undefined;

  @Column({ default: true })
  isActive: boolean | undefined;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments!: Enrollment[];

  @UpdateDateColumn()
  updatedAt: Date | undefined;
}


