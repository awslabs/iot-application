import {
  IoTSiteWiseClient,
  paginateListAssets,
} from "@aws-sdk/client-iotsitewise";

import type { AssetSummary } from "../../entities/SiteWise";
import logger from "../../services/logger";

class ListAssets {
  private client: IoTSiteWiseClient;

  constructor(client: IoTSiteWiseClient) {
    this.client = client;
  }

  public async invoke(): Promise<AssetSummary[]> {
    try {
      const assetSummaries: AssetSummary[] = [];
      for await (const page of paginateListAssets(
        { client: this.client },
        { filter: "TOP_LEVEL" },
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

export default ListAssets;
