import React, { useEffect, useState } from 'react';
import { Link, useMatches } from 'react-router-dom';
import { Dashboard as IoTDashboard, Widget } from '@iot-app-kit/dashboard';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { initialize, SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { Auth } from 'aws-amplify';
import '../styles/dashboard.css';

const region = 'us-east-2';
const DEMO_ASSET = '4db9a36d-971e-4863-b34c-b886561c8cd1';
const DEMO_PROPERTY = '2d941621-8ea8-499f-a1bd-69522f731c9e';
const widgets: Widget[] = [
  {
    id: 'kpi-widget',
    componentTag: 'iot-kpi',
    x: 3,
    y: 9,
    z: 1,
    width: 28,
    height: 15,
    assets: [
      {
        assetId: DEMO_ASSET,
        properties: [{ propertyId: DEMO_PROPERTY }],
      },
    ],
  },
  {
    id: 'line-widget',
    componentTag: 'iot-line-chart',
    x: 31,
    y: 7,
    z: 1,
    width: 46,
    height: 35,
    assets: [
      {
        assetId: DEMO_ASSET,
        properties: [{ propertyId: DEMO_PROPERTY }],
      },
    ],
  },
];

const Dashboard: React.FC = () => {
  const matches = useMatches();
  const dashboardId = matches[matches.length - 1]?.params.id;
  const [query, setQuery] = useState<SiteWiseQuery>();
  const [client, setClient] = useState<IoTSiteWiseClient>();

  useEffect(() => {
    const setupCredentials = async () => {
      const credentials = await Auth.currentCredentials();

      const { query: siteWiseQuery } = initialize({
        awsCredentials: credentials,
        awsRegion: region,
      });

      setQuery(siteWiseQuery);

      const siteWiseClient = new IoTSiteWiseClient({
        region,
        credentials,
      });

      setClient(siteWiseClient);
    };

    setupCredentials().catch((e) => {
      throw e;
    });
  }, []);

  return (
    <React.Fragment>
      <div>
        <nav>
          <Link to={'/dashboards'}>Dashboard list</Link>
        </nav>
        <h1>dashboard view for {dashboardId}</h1>
      </div>
      <div className="dashboard">
        {query && client && (
          <IoTDashboard
            client={client}
            query={query}
            dashboardConfiguration={{
              widgets,
              viewport: {
                duration: '10m',
              },
            }}
          />
        )}
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
