import { IoTSiteWiseClient } from "@aws-sdk/client-iotsitewise";

import DescribeAsset from "./DescribeAsset";
import ListAssets from "./ListAssets";
import ListAssociatedAssets from "./ListAssociatedAssets";

class IoTSiteWiseGateway {
  private client: IoTSiteWiseClient;
  private _describeAsset: DescribeAsset;
  private _listAssets: ListAssets;
  private _listAssociatedAssets: ListAssociatedAssets;

  constructor(client: IoTSiteWiseClient) {
    this.client = client;
    this._describeAsset = new DescribeAsset(this.client);
    this._listAssets = new ListAssets(this.client);
    this._listAssociatedAssets = new ListAssociatedAssets(this.client);
  }

  public async describeAsset(assetId: string) {
    return this._describeAsset.invoke(assetId);
  }

  public async listAssets() {
    return this._listAssets.invoke();
  }

  public async listAssociatedAssets(assetId: string, hierarchyId: string) {
    return this._listAssociatedAssets.invoke(assetId, hierarchyId);
  }
}

export default IoTSiteWiseGateway;
