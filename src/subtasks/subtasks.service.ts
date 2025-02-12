import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { LoggerService } from '../logger/logger.service';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { Subtask } from './interfaces/subtask.interface';

interface FirebaseSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

@Injectable()
export class SubtasksService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly logger: LoggerService,
  ) {}

  async findOne(id: string): Promise<Subtask> {
    this.logger.log(`Fetching subtask with id: ${id}`, 'SubtasksService');
    try {
      const subtask = await this.firebaseService.getDocument<FirebaseSubtask>('subtasks', id);
      
      if (!subtask) {
        throw new Error(`Subtask with id ${id} not found`);
      }

      return {
        id: subtask.id,
        title: subtask.title,
        isCompleted: subtask.isCompleted,
        taskId: subtask.taskId,
        createdAt: subtask.createdAt?.toDate(),
        updatedAt: subtask.updatedAt?.toDate(),
      };
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

  async update(id: string, updateSubtaskDto: UpdateSubtaskDto): Promise<Subtask> {
    this.logger.log(`Updating subtask with id: ${id}`, 'SubtasksService');
    try {
      const existingSubtask = await this.findOne(id);
      
      const updatedSubtask = {
        ...existingSubtask,
        ...updateSubtaskDto,
        updatedAt: new Date(),
      };

      await this.firebaseService.updateDocument('subtasks', id, updatedSubtask);
      
      this.logger.debug(`Subtask updated with id: ${id}`, 'SubtasksService');
      return updatedSubtask;
    } catch (error) {
      this.logger.error(
        `Error updating subtask with id: ${id}`,
        error.stack,
        'SubtasksService',
      );
      throw error;
    }
  }
}
