import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { SubtasksModule } from './subtasks/subtasks.module';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [BoardsModule, ColumnsModule, TasksModule, SubtasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
