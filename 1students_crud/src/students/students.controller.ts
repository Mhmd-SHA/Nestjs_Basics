import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './entities/student.entity';
import { findByIdStudentDto } from './dto/findById-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async findAll() {
    const studentList = await this.studentsService.findAll();
    console.log('findAll called');

    return {
      statusCode: HttpStatus.OK,
      message: 'Students retrieved successfully',
      data: studentList,
    };
  }

  @Post()
  // @UseFilters(new HttpExceptionFilter())
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      const student: Student =
        await this.studentsService.create(createStudentDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Students Created successfully',
        data: student,
      };
    } catch (error) {
      console.log('error :>> ', error);
      throw new HttpException(
        'Failed to Create A Student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) studentID: number) {
    const dto: findByIdStudentDto = { id: studentID };

    const student = await this.studentsService.findOne(dto.id);
    if (student) {
      return {
        statusCode: HttpStatus.OK,
        message: 'Students found successfully',
        student: student,
      };
    }
    throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    try {
      return await this.studentsService.update(id, updateStudentDto);
    } catch (error) {
      console.log('error :>> ', error);
      throw new HttpException(
        'Failed to Update Student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.studentsService.delete(+id);
  }
}
