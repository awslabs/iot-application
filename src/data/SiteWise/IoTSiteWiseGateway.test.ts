import type {
  IoTSiteWiseClient,
  DescribeAssetCommandOutput,
  ListAssetsCommandOutput,
  ListAssociatedAssetsCommandOutput,
} from "@aws-sdk/client-iotsitewise";
import IoTSiteWiseGateway from "./IoTSiteWiseGateway";

test("user can describe an asset", async () => {
  const output: DescribeAssetCommandOutput = {
    assetId: "00000000-0000-0000-0000-000000000000",
    assetArn:
      "arn:aws:iotsitewise:region:123456789012:asset/00000000-0000-0000-0000-000000000000",
    assetName: "assetName",
    assetModelId: "assetModelId",
    assetCreationDate: new Date(0),
    assetLastUpdateDate: new Date(0),
    assetStatus: { state: "ACTIVE" },
    assetHierarchies: [],
    assetDescription: "assetDescription",
    assetCompositeModels: [],
    assetProperties: [],
    $metadata: {},
  };
  const testClient = {
    send: vi.fn().mockResolvedValue(output),
  } as unknown as IoTSiteWiseClient;
  const gateway = new IoTSiteWiseGateway(testClient);

  const asset = await gateway.describeAsset(
    "00000000-0000-0000-0000-000000000000",
  );

  expect(asset).toEqual({
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
  });
});

test("user gets the identity of asset when there is an error describing an asset", async () => {
  const testClient = {
    send: vi.fn().mockRejectedValue(undefined),
  } as unknown as IoTSiteWiseClient;
  const gateway = new IoTSiteWiseGateway(testClient);

  const asset = await gateway.describeAsset(
    "00000000-0000-0000-0000-000000000000",
  );

  expect(asset).toEqual({
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
  });
});

test("user can list assets", async () => {
  const output: ListAssetsCommandOutput = {
    assetSummaries: [],
    $metadata: {},
  };
  const testClient = {
    send: vi.fn().mockResolvedValue(output),
  } as unknown as IoTSiteWiseClient;
  const gateway = new IoTSiteWiseGateway(testClient);

  const assetSummaries = await gateway.listAssets();

  expect(assetSummaries).toEqual(output.assetSummaries);
});

test("user gets an empty list of assets when there are none", async () => {
  const testClient = {
    send: vi.fn().mockResolvedValue([]),
  } as unknown as IoTSiteWiseClient;
  const gateway = new IoTSiteWiseGateway(testClient);

  const assetSummaries = await gateway.listAssets();

  expect(assetSummaries).toEqual([]);
});

test("user gets an empty list of assets when there is an error", async () => {
  const testClient = {
    send: vi.fn().mockRejectedValue(undefined),
  } as unknown as IoTSiteWiseClient;
  const gateway = new IoTSiteWiseGateway(testClient);

  const assetSummaries = await gateway.listAssets();

  expect(assetSummaries).toEqual([]);
});

test("user can list associated assets", async () => {
  const output: ListAssociatedAssetsCommandOutput = {
    assetSummaries: [],
    $metadata: {},
  };
  const testClient = {
    send: vi.fn().mockResolvedValue(output),
  } as unknown as IoTSiteWiseClient;
  const gateway = new IoTSiteWiseGateway(testClient);

  const assetSummaries = await gateway.listAssociatedAssets(
    "00000000-0000-0000-0000-000000000000",
    "00000000-0000-0000-0000-000000000000",
  );

  expect(assetSummaries).toEqual(output.assetSummaries);
});

test("user gets an empty list of associated assets when there are none", async () => {
  const testClient = {
    send: vi.fn().mockResolvedValue([]),
  } as unknown as IoTSiteWiseClient;
  const gateway = new IoTSiteWiseGateway(testClient);

  const assetSummaries = await gateway.listAssociatedAssets(
    "00000000-0000-0000-0000-000000000000",
    "00000000-0000-0000-0000-000000000000",
  );

  expect(assetSummaries).toEqual([]);
});

test("user gets an empty list of associated assets when there is an error", async () => {
  const testClient = {
    send: vi.fn().mockRejectedValue(undefined),
  } as unknown as IoTSiteWiseClient;
  const gateway = new IoTSiteWiseGateway(testClient);

  const assetSummaries = await gateway.listAssociatedAssets(
    "00000000-0000-0000-0000-000000000000",
    "00000000-0000-0000-0000-000000000000",
  );

  expect(assetSummaries).toEqual([]);
});
