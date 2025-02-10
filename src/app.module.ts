import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [BoardsModule, ColumnsModule, TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
