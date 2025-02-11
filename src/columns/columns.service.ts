import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { LoggerService } from '../logger/logger.service';
import { Column } from './interfaces/column.interface';

interface FirebaseColumn {
  id: string;
  name: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  boardId: string;
  position: number;
}

interface FirebaseTask {
  id: string;
  title: string;
  description: string;
  boardId: string;
  columnId: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

interface FirebaseSubtask {
  id: string;
  title: string;
  isCompleted: boolean;
  taskId: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

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

  async findAllColumnsByBoardId(boardId: string): Promise<Column[]> {
    this.logger.log(`Fetching all columns with tasks and subtasks by board id: ${boardId}`, 'ColumnsService');
    try {
      // First, get all columns for the board
      const columns = await this.firebaseService.getDocumentsWhere<FirebaseColumn>(
        'columns',
        'boardId',
        '==',
        boardId,
      );

      // Then, get all tasks for this board
      const tasks = await this.firebaseService.getDocumentsWhere<FirebaseTask>(
        'tasks',
        'boardId',
        '==',
        boardId,
      );

      // Get all subtasks for tasks in this board
      const taskIds = tasks.map(task => task.id);
      const subtasks = await Promise.all(
        taskIds.map(taskId =>
          this.firebaseService.getDocumentsWhere<FirebaseSubtask>(
            'subtasks',
            'taskId',
            '==',
            taskId,
          ),
        ),
      );

      // Flatten subtasks array
      const allSubtasks = subtasks.flat();

      // Map tasks to their respective columns with subtasks
      const columnsWithTasks = columns.map(column => ({
        id: column.id,
        name: column.name,
        createdAt: column.createdAt?.toDate(),
        updatedAt: column.updatedAt?.toDate(),
        boardId: column.boardId,
        position: column.position,
        tasks: tasks
          .filter(task => task.columnId === column.id)
          .map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            boardId: task.boardId,
            columnId: task.columnId,
            createdAt: task.createdAt?.toDate(),
            updatedAt: task.updatedAt?.toDate(),
            subtasks: allSubtasks
              .filter(subtask => subtask.taskId === task.id)
              .map(subtask => ({
                id: subtask.id,
                title: subtask.title,
                isCompleted: subtask.isCompleted,
                taskId: subtask.taskId,
                createdAt: subtask.createdAt?.toDate(),
                updatedAt: subtask.updatedAt?.toDate(),
              })),
          })),
      }));

      // Sort columns by position
      columnsWithTasks.sort((a, b) => a.position - b.position);

      this.logger.debug(
        `Found ${columnsWithTasks.length} columns with ${tasks.length} tasks and ${allSubtasks.length} subtasks for board id: ${boardId}`,
        'ColumnsService',
      );
      
      return columnsWithTasks;
    } catch (error) {
      this.logger.error(
        `Error fetching columns with tasks and subtasks for board id: ${boardId}`,
        error.stack,
        'ColumnsService',
      );
      throw error;
    }
  }
}
