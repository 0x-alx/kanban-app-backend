import { Controller, Get } from '@nestjs/common';
import { Board } from '../interfaces/board.interface';
import { BoardsService } from '../services/boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  async getBoards(): Promise<Board> {
    return this.boardsService.getBoards();
  }
} 