import { plainToInstance } from 'class-transformer';

import { Dashboard } from 'types';

export class DashboardsDeserializer {
  public deserialize(json: unknown): Dashboard {
    return plainToInstance(Dashboard, json);
  }

  public deserializeList(json: unknown[]): Dashboard[] {
    return json.map(this.deserialize);
  }
}
