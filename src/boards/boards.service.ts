import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class BoardsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll() {
    return await this.firebaseService.getDocuments('boards');
  }

  async findOne(id: string) {
    return await this.firebaseService.getDocument('boards', id);
  }

  async create(data: any) {
    return await this.firebaseService.addDocument('boards', data);
  }
}
