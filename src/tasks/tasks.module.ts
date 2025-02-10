import { Module } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, FirebaseService],
})
export class TasksModule {}
