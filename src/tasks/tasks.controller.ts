import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('by-column')
  async findAllByColumnId(@Query('columnId') columnId: string) {
    console.log('columnId', columnId);
    return this.tasksService.findAllTasksByColumnId(columnId);
  }

  @Get('by-board')
  async findAllByBoardId(@Query('boardId') boardId: string) {
    console.log('boardId', boardId);
    return this.tasksService.findAllTasksByBoardId(boardId);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    console.log('id', id);
    return this.tasksService.findOne(id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const createdAt = new Date();
    const updatedAt = new Date();
    const task = { ...createTaskDto, createdAt, updatedAt };
    console.log('task', task);
    return this.tasksService.create(task)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
