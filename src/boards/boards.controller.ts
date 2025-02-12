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
    const createdAt = new Date();
    const updatedAt = new Date();
    const board = { ...createBoardDto, createdAt, updatedAt, };
    return this.boardsService.create(board);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.boardsService.delete(id);
  }
}
