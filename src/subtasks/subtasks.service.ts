import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { LoggerService } from '../logger/logger.service';
@Injectable()
export class SubtasksService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly logger: LoggerService,
  ) {}

  async findOne(id: string) {
    this.logger.log(`Fetching subtask with id: ${id}`, 'SubtasksService');
    try {
      const subtask = await this.firebaseService.getDocument('subtasks', id);
      this.logger.debug(`Subtask fetched with id: ${id}`, 'SubtasksService');
      return subtask;
    } catch (error) {
      this.logger.error(`Error fetching subtask with id: ${id}`, error.stack, 'SubtasksService');
      throw error;
    }
  }

  async create(data: any) {
    this.logger.log('Creating subtask', 'SubtasksService');
    try {
      const subtask = await this.firebaseService.addDocument('subtasks', data);
      this.logger.debug(`Subtask created with id: ${subtask.id}`, 'SubtasksService');
      return subtask;
    } catch (error) {
      this.logger.error('Error creating subtask', error.stack, 'SubtasksService');
      throw error;
    }
  }

  async delete(id: string) {
    this.logger.log(`Deleting subtask with id: ${id}`, 'SubtasksService');
    try {
      await this.firebaseService.deleteDocument('subtasks', id);
      this.logger.debug(`Subtask deleted with id: ${id}`, 'SubtasksService');
    } catch (error) {
      this.logger.error(`Error deleting subtask with id: ${id}`, error.stack, 'SubtasksService');
      throw error;
    }
  }
  
  async findAllSubtasksByTaskId(taskId: string) {
    this.logger.log(`Fetching all subtasks by task id: ${taskId}`, 'SubtasksService');
    try {
      const subtasks = await this.firebaseService.getDocumentsWhere(
        'subtasks',
        'taskId',
        '==',
        taskId
      );
      this.logger.debug(`Found ${subtasks.length} subtasks by task id: ${taskId}`, 'SubtasksService');
      return subtasks;
    } catch (error) {
      this.logger.error(`Error fetching all subtasks by task id: ${taskId}`, error.stack, 'SubtasksService');
      throw error;
    }
  }
}
