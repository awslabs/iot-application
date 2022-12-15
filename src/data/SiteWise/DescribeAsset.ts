import {
  IoTSiteWiseClient,
  DescribeAssetCommand,
  DescribeAssetCommandOutput,
} from "@aws-sdk/client-iotsitewise";

import type { Asset } from "../../entities/SiteWise";
import logger from "../../services/logger";

class DescribeAsset {
  private client: IoTSiteWiseClient;

  constructor(client: IoTSiteWiseClient) {
    this.client = client;
  }

  public async invoke(assetId: string): Promise<Asset> {
    try {
      const command = new DescribeAssetCommand({ assetId });
      const output = await this.client.send(command);

      return this.mapOutputToAsset(output);
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      }

      return this.createAssetIdentity();
    }
  }

  private mapOutputToAsset(output: DescribeAssetCommandOutput): Asset {
    return {
      id: output.assetId,
      arn: output.assetArn,
      name: output.assetName,
      assetModelId: output.assetModelId,
      creationDate: output.assetCreationDate,
      lastUpdateDate: output.assetLastUpdateDate,
      status: output.assetStatus,
      hierarchies: output.assetHierarchies,
      description: output.assetDescription,
      compositeModels: output.assetCompositeModels,
      properties: output.assetProperties,
    };
  }

  private createAssetIdentity() {
    return {
      id: undefined,
      arn: undefined,
      name: undefined,
      assetModelId: undefined,
      creationDate: undefined,
      lastUpdateDate: undefined,
      status: undefined,
      hierarchies: undefined,
      description: undefined,
      compositeModels: undefined,
      properties: undefined,
    };
  }
}

export default DescribeAsset;
