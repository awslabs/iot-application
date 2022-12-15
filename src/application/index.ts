import { IoTSiteWiseClient } from "@aws-sdk/client-iotsitewise";
import IoTSiteWiseGateway from "../data/SiteWise";

const client = new IoTSiteWiseClient({
  region: "us-west-2",
  credentials: {
    secretAccessKey: "",
    accessKeyId: "",
  },
});

export default new IoTSiteWiseGateway(client);
