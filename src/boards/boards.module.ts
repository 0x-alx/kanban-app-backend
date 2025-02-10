import { Module } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService, FirebaseService],
})
export class BoardsModule {}
