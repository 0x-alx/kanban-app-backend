import { Subtask } from '../../subtasks/interfaces/subtask.interface';

export interface Task {
  id: string;
  title: string;
  description: string;
  boardId: string;
  columnId: string;
  createdAt: Date;
  updatedAt: Date;
  subtasks: Subtask[];
} 