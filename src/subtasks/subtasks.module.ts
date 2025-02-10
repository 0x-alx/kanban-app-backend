import { Module } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { SubtasksController } from './subtasks.controller';
import { SubtasksService } from './subtasks.service';

@Module({
  controllers: [SubtasksController],
  providers: [SubtasksService, FirebaseService],
})
export class SubtasksModule {}
