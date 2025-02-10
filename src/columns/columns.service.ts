import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { LoggerService } from '../logger/logger.service';
@Injectable()
export class ColumnsService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly logger: LoggerService,
  ) {}

  async findOne(id: string) {
    this.logger.log(`Fetching column with id: ${id}`, 'ColumnsService');
    try {
      const column = await this.firebaseService.getDocument('columns', id);
      this.logger.debug(`Column fetched with id: ${id}`, 'ColumnsService');
      return column;
    } catch (error) {
      this.logger.error(
        `Error fetching column with id: ${id}`,
        error.stack,
        'ColumnsService',
      );
      throw error;
    }
  }

  async create(data: any) {
    this.logger.log('Creating column', 'ColumnsService');
    try {
      const column = await this.firebaseService.addDocument('columns', data);
      this.logger.debug(`Column created with id: ${column.id}`, 'ColumnsService');
      return column;
    } catch (error) {
      this.logger.error('Error creating column', error.stack, 'ColumnsService');
      throw error;
    }
  }

  async delete(id: string) {
    this.logger.log(`Deleting column with id: ${id}`, 'ColumnsService');
    try {
      await this.firebaseService.deleteDocument('columns', id);
      this.logger.debug(`Column deleted with id: ${id}`, 'ColumnsService');
    } catch (error) {
      this.logger.error(`Error deleting column with id: ${id}`, error.stack, 'ColumnsService');
      throw error;
    }
  }

  async findAllColumnsByBoardId(boardId: string) {
    this.logger.log(`Fetching all columns by board id: ${boardId}`, 'ColumnsService');
    try {
      const columns = await this.firebaseService.getDocumentsWhere(
        'columns',
        'boardId',
        '==',
        boardId,
      );
      this.logger.debug(`Found ${columns.length} columns by board id: ${boardId}`, 'ColumnsService');
      return columns;
    } catch (error) {
      this.logger.error(
        `Error fetching all columns by board id: ${boardId}`,
        error.stack,
        'ColumnsService',
      );
      throw error;
    }
  }
}
