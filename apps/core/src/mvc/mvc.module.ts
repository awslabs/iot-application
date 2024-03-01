import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MvcController } from './mvc.controller';
import { authConfig } from '../config/auth.config';
import { edgeConfig } from '../config/edge.config';
import { globalConfig } from '../config/global.config';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    ConfigModule.forFeature(edgeConfig),
    ConfigModule.forFeature(globalConfig),
  ],
  controllers: [MvcController],
  providers: [],
})
export class MvcModule {}
