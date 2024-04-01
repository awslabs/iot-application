import { Module, ModuleMetadata } from '@nestjs/common';

import { EdgeLoginController } from './edge-login.controller';
import { EdgeLoginService } from './edge-login.service';
import { HttpModule } from '@nestjs/axios';

export const edgeLoginModuleMetadata: ModuleMetadata = {
  imports: [HttpModule],
  controllers: [EdgeLoginController],
  providers: [EdgeLoginService],
};

/** Core Dashboards Module */
@Module(edgeLoginModuleMetadata)
export class EdgeLoginModule {}
