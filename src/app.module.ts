import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';


@Module({
  imports: [BoardsModule, ColumnsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
