import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { SubtasksService } from './subtasks.service';

@Controller('subtasks')
export class SubtasksController {
  constructor(
    private readonly subtasksService: SubtasksService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  async findAllByTaskId(@Query('taskId') taskId: string) {
    console.log('taskId', taskId);
    return this.subtasksService.findAllSubtasksByTaskId(taskId);
  }

  @Post()
  async create(@Body() createSubtaskDto: CreateSubtaskDto) {
    const createdAt = new Date();
    const updatedAt = new Date();
    const isCompleted = false;
    const subtask = { ...createSubtaskDto, createdAt, updatedAt, isCompleted };
    console.log('subtask', subtask);
    return this.subtasksService.create(subtask)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.subtasksService.delete(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSubtaskDto: UpdateSubtaskDto) {
    this.logger.log(`Updating subtask with id: ${id}`, 'SubtasksController');
    return this.subtasksService.update(id, updateSubtaskDto);
  }
}
