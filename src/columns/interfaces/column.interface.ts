import { Task } from '../../tasks/interfaces/task.interface';

export interface Column {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  boardId: string;
  position: number;
  tasks: Task[];
} 