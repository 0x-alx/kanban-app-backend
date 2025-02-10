import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ColumnsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async findOne(id: string) {
    return await this.firebaseService.getDocument('columns', id);
  }

  async create(data: any) {
    return await this.firebaseService.addDocument('columns', data);
  }

  async delete(id: string) {
    return await this.firebaseService.deleteDocument('columns', id);
  }

  async findAllColumnsByBoardId(boardId: string) {
    return await this.firebaseService.getDocumentsWhere(
      'columns',
      'boardId',
      '==',
      boardId
    )
  }
}
