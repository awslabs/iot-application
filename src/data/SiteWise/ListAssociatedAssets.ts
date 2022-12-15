import {
  IoTSiteWiseClient,
  paginateListAssociatedAssets,
} from "@aws-sdk/client-iotsitewise";

import type { AssetSummary } from "../../entities/SiteWise";
import logger from "../../services/logger";

class ListAssociatedAssets {
  private client: IoTSiteWiseClient;

  constructor(client: IoTSiteWiseClient) {
    this.client = client;
  }

  public async invoke(
    assetId: string,
    hierarchyId: string,
  ): Promise<AssetSummary[]> {
    try {
      const assetSummaries: AssetSummary[] = [];
      for await (const page of paginateListAssociatedAssets(
        { client: this.client },
        { assetId, hierarchyId },
      )) {
        if (page.assetSummaries != null) {
          assetSummaries.push(...page.assetSummaries);
        }
      }

      return assetSummaries;
    } catch (e) {
      if (e instanceof Error) {
        logger.error(e.message);
      }

      return [];
    }
  }
}

export default ListAssociatedAssets;
