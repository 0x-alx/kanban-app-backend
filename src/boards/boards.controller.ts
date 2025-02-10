import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  async findAll() {
    return this.boardsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.boardsService.findOne(id);
  }

  @Post()
  async create(@Body() createBoardDto: any) {
    console.log('createBoardDto', createBoardDto);
    return this.boardsService.create(createBoardDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return { message: 'Board deleted successfully', id };
  }
}
