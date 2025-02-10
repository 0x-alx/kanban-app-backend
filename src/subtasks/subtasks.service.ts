import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class SubtasksService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async findOne(id: string) {
    return await this.firebaseService.getDocument('subtasks', id);
  }

  async create(data: any) {
    return await this.firebaseService.addDocument('subtasks', data);
  }

  async delete(id: string) {
    return await this.firebaseService.deleteDocument('subtasks', id);
  }
  
  async findAllSubtasksByTaskId(taskId: string) {
    return await this.firebaseService.getDocumentsWhere(
      'subtasks',
      'taskId',
      '==',
      taskId
    )
  }
}
