import type { DescribeAssetCommandOutput } from "@aws-sdk/client-iotsitewise";

type output = DescribeAssetCommandOutput;
export default interface Asset {
  id: output["assetId"];
  arn: output["assetArn"];
  name: output["assetName"];
  assetModelId: output["assetModelId"];
  creationDate: output["assetCreationDate"];
  lastUpdateDate: output["assetLastUpdateDate"];
  status: output["assetStatus"];
  hierarchies: output["assetHierarchies"];
  description: output["assetDescription"];
  compositeModels: output["assetCompositeModels"];
  properties: output["assetProperties"];
}
