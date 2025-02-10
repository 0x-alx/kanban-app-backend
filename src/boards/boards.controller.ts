import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
    return this.boardsService.create(createBoardDto);
  }
}
