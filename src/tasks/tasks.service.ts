import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class TasksService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async findOne(id: string) {
    return await this.firebaseService.getDocument('tasks', id);
  }

  async create(data: any) {
    return await this.firebaseService.addDocument('tasks', data);
  }

  async delete(id: string) {
    return await this.firebaseService.deleteDocument('tasks', id);
  }

  async findAllTasksByBoardId(boardId: string) {
    return await this.firebaseService.getDocumentsWhere(
      'tasks',
      'boardId',
      '==',
      boardId
    )
  }
  
  async findAllTasksByColumnId(columnId: string) {
    return await this.firebaseService.getDocumentsWhere(
      'tasks',
      'columnId',
      '==',
      columnId
    )
  }
}
