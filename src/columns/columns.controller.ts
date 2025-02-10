import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Get()
  async findAll(@Query('boardId') boardId: string) {
    console.log('boardId', boardId);
    return this.columnsService.findAllColumnsByBoardId(boardId);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    console.log('id', id);
    return this.columnsService.findOne(id);
  }

  @Post()
  async create(@Body() createColumnDto: CreateColumnDto) {
    const { boardId, ...columnData } = createColumnDto;
    const columns = await this.columnsService.findAllColumnsByBoardId(boardId);
    const position = columns.length;
    const createdAt = new Date();
    const updatedAt = new Date();
    const column = { ...columnData, boardId, position, createdAt, updatedAt };
    return this.columnsService.create(column)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.columnsService.delete(id);
  }
}
