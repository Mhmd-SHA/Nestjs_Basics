import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { Injectable } from '@nestjs/common/decorators';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  create(studentData: CreateStudentDto): Promise<Student> {
    const student = this.studentRepository.create(studentData);
    return this.studentRepository.save(student);
  }

  findAll() {
    return this.studentRepository.find();
  }

  async findOne(studentId: number) {
    return await this.studentRepository.findOneBy({ id: studentId });
  }

  async update(id: number, data: UpdateStudentDto) {
    await this.studentRepository.update({ id: id }, data);

    return this.studentRepository.findOneBy({ id: id });
  }

  delete(id: number) {
    return this.studentRepository.delete(id);
  }
}
