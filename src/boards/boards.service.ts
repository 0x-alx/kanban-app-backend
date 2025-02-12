import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class BoardsService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly logger: LoggerService,
  ) {}

  async findAll() {
    this.logger.log('Fetching all boards', 'BoardsService');
    try {
      const boards = await this.firebaseService.getDocuments('boards');
      this.logger.debug(`Found ${boards.length} boards`, 'BoardsService');
      return boards;
    } catch (error) {
      this.logger.error(
        'Error fetching boards',
        error.stack,
        'BoardsService',
      );
      throw error;
    }
  }

  async findOne(id: string) {
    this.logger.log(`Fetching board with id: ${id}`, 'BoardsService');
    try {
      const board = await this.firebaseService.getDocument('boards', id);
      this.logger.debug(`Found board with id: ${id}`, 'BoardsService');
      return board;
    } catch (error) {
      this.logger.error(
        `Error fetching board with id: ${id}`,
        error.stack,
        'BoardsService',
      );
      throw error;
    }
  }

  async create(data: any) {
    this.logger.log('Creating board', 'BoardsService');
    try {
      const board = await this.firebaseService.addDocument('boards', data);
      this.logger.debug(`Board created with id: ${board.id}`, 'BoardsService');
      return board;
    } catch (error) {
      this.logger.error('Error creating board', error.stack, 'BoardsService');
      throw error;
    }
  }

  async delete(id: string) {
    this.logger.log(`Deleting board with id: ${id}`, 'BoardsService');
    try {
      await this.firebaseService.deleteDocument('boards', id);
      this.logger.debug(`Board deleted with id: ${id}`, 'BoardsService');
    } catch (error) {
      this.logger.error(
        `Error deleting board with id: ${id}`,
        error.stack,
        'BoardsService',
      );
      throw error;
    }
  }
}
