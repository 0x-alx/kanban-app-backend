import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { LoggerService } from '../logger/logger.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './interfaces/task.interface';

interface FirebaseTask {
  id: string;
  title: string;
  description: string;
  boardId: string;
  columnId: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

@Injectable()
export class TasksService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly logger: LoggerService,
  ) {}

  async findOne(id: string): Promise<Task> {
    this.logger.log(`Fetching task with id: ${id}`, 'TasksService');
    try {
      const task = await this.firebaseService.getDocument<FirebaseTask>('tasks', id);
      
      if (!task) {
        throw new Error(`Task with id ${id} not found`);
      }

      // Convert Firebase Timestamp to Date
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        boardId: task.boardId,
        columnId: task.columnId,
        createdAt: task.createdAt?.toDate(),
        updatedAt: task.updatedAt?.toDate(),
        subtasks: [], // We'll fetch subtasks separately if needed
      };
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

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    this.logger.log(`Updating task with id: ${id}`, 'TasksService');
    console.log('updateTaskDto', updateTaskDto);
    console.log('id', id);
    console.log('this.findOne(id)', await this.findOne(id));
    try {
      const existingTask = await this.findOne(id);
      
      const updatedTask = {
        ...existingTask,
        ...updateTaskDto,
        updatedAt: new Date(),
      };

      await this.firebaseService.updateDocument('tasks', id, updatedTask);
      
      this.logger.debug(`Task updated with id: ${id}`, 'TasksService');
      return updatedTask;
    } catch (error) {
      this.logger.error(
        `Error updating task with id: ${id}`,
        error.stack,
        'TasksService',
      );
      throw error;
    }
  }
}
