import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { LoggerService } from '../logger/logger.service';
@Injectable()
export class TasksService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly logger: LoggerService,
  ) {}

  async findOne(id: string) {
    this.logger.log(`Fetching task with id: ${id}`, 'TasksService');
    try {
      const task = await this.firebaseService.getDocument('tasks', id);
      this.logger.debug(`Task fetched with id: ${id}`, 'TasksService');
      return task;
    } catch (error) {
      this.logger.error(`Error fetching task with id: ${id}`, error.stack, 'TasksService');
      throw error;
    }
  }

  async create(data: any) {
    this.logger.log('Creating task', 'TasksService');
    try {
      const task = await this.firebaseService.addDocument('tasks', data);
      this.logger.debug(`Task created with id: ${task.id}`, 'TasksService');
      return task;
    } catch (error) {
      this.logger.error('Error creating task', error.stack, 'TasksService');
      throw error;
    }
  }

  async delete(id: string) {
    this.logger.log(`Deleting task with id: ${id}`, 'TasksService');
    try {
      await this.firebaseService.deleteDocument('tasks', id);
      this.logger.debug(`Task deleted with id: ${id}`, 'TasksService');
    } catch (error) {
      this.logger.error(`Error deleting task with id: ${id}`, error.stack, 'TasksService');
      throw error;
    }
  }
  async findAllTasksByBoardId(boardId: string) {
    this.logger.log(`Fetching all tasks by board id: ${boardId}`, 'TasksService');
    try {
      const tasks = await this.firebaseService.getDocumentsWhere(
        'tasks',
        'boardId',
        '==',
        boardId
      );
      this.logger.debug(`Found ${tasks.length} tasks by board id: ${boardId}`, 'TasksService');
      return tasks;
    } catch (error) {
      this.logger.error(`Error fetching all tasks by board id: ${boardId}`, error.stack, 'TasksService');
      throw error;
    }
  }
  
  async findAllTasksByColumnId(columnId: string) {
    this.logger.log(`Fetching all tasks by column id: ${columnId}`, 'TasksService');
    try {
      const tasks = await this.firebaseService.getDocumentsWhere(
        'tasks',
        'columnId',
        '==',
        columnId
      );
      this.logger.debug(`Found ${tasks.length} tasks by column id: ${columnId}`, 'TasksService');
      return tasks;
    } catch (error) {
      this.logger.error(
        `Error fetching all tasks by column id: ${columnId}`,
        error.stack,
        'TasksService',
      );
      throw error;
    }
  }
}
