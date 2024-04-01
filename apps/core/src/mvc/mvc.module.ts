import { Module } from '@nestjs/common';
import { MvcController } from './mvc.controller';

@Module({
  imports: [],
  controllers: [MvcController],
  providers: [],
})
export class MvcModule {}
