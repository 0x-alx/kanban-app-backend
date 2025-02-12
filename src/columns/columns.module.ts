import { Module } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService, FirebaseService],
})
export class ColumnsModule {}
