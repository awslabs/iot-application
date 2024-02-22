import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EdgeLoginService } from './edge-login.service';
import { Public } from '../auth/public.decorator';
import { EdgeCredentials } from './entities/edge-credentials.entity';
import { EdgeLoginBody } from './entities/edge-login-body.entity';
import { isErr } from '../types';

@ApiTags('edge-login')
@Controller('api/edge-login')
export class EdgeLoginController {
  constructor(private readonly edgeLoginService: EdgeLoginService) {}

  @Public()
  @Post()
  public async edgeLogin(
    @Body() edgeLoginBody: EdgeLoginBody,
  ): Promise<EdgeCredentials> {
    const result = await this.edgeLoginService.login(edgeLoginBody);

    if (isErr(result)) {
      throw result.err;
    }

    return result.ok;
  }
}
