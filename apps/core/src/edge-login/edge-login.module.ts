import { HttpModule } from '@nestjs/axios';
import { Module, ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EdgeLoginController } from './edge-login.controller';
import { EdgeLoginService } from './edge-login.service';
import { edgeConfig } from '../config/edge.config';

export const edgeLoginModuleMetadata: ModuleMetadata = {
  imports: [ConfigModule.forFeature(edgeConfig), HttpModule],
  controllers: [EdgeLoginController],
  providers: [EdgeLoginService],
};

/** Core Dashboards Module */
@Module(edgeLoginModuleMetadata)
export class EdgeLoginModule {}
