import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Board } from '../interfaces/board.interface';

@Injectable()
export class BoardsService {
  private readonly dataPath = join(process.cwd(), 'data.json');

  async getBoards(): Promise<Board> {
    try {
      const data = await readFile(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Failed to read data.json');
    }
  }
} 