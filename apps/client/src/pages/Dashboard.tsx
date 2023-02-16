import React, { useEffect, useState } from 'react';
import { useMatches } from 'react-router-dom';
// import {
//   Dashboard as IoTDashboard,
//   DashboardConfiguration,
// } from '@iot-app-kit/dashboard';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { initialize, SiteWiseQuery } from '@iot-app-kit/source-iotsitewise';
import { DashboardsModule } from 'src/dashboards/dashboards.module';
import auth from '../auth/auth';
import '../styles/dashboard.css';

const DEFAULT_REGION = 'us-east-1';

const Dashboard: React.FC = () => {
  const dashboardsModule = new DashboardsModule();
  const matches = useMatches();
  const dashboardId = matches[matches.length - 1]?.params.id;
  const [query, setQuery] = useState<SiteWiseQuery>();
  const [client, setClient] = useState<IoTSiteWiseClient>();
  // const [dashboardConfiguration, setDashboardConfiguration] =
  //   useState<DashboardConfiguration>({
  //     widgets: [],
  //     viewport: {
  //       duration: '5m',
  //     },
  //   });
  const [dashboardName, setDashboardName] = useState<string>();
  const [dashboardDescription, setDashboardDescription] = useState<string>();

  const setupCredentials = () => {
    const credentials = auth().getCredentials();
    const region = process.env.AWS_REGION ?? DEFAULT_REGION;

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

  useEffect(() => {
    setupCredentials();

    if (dashboardId) {
      const fetchDashboard = async () => {
        const newDashboard = await dashboardsModule.http.read(dashboardId);
        // setDashboardConfiguration(
        //   newDashboard.definition as unknown as DashboardConfiguration,
        // );
        setDashboardName(newDashboard.name);
        setDashboardDescription(newDashboard.description);
      };

      void fetchDashboard();
    }
  }, []);

  // const saveDashboard = async (dashboard: DashboardConfiguration) => {
  //   if (dashboardId && dashboardName) {
  //     const updatedDashboard = await dashboardsModule.http.update(
  //       dashboardId,
  //       dashboardName,
  //       dashboardDescription ?? '',
  //       dashboard,
  //     );
  //
  //     setDashboardConfiguration(
  //       updatedDashboard.definition as unknown as DashboardConfiguration,
  //     );
  //   }
  // };

  // <IoTDashboard
  //   client={client}
  //   query={query}
  //   dashboardConfiguration={dashboardConfiguration}
  //   onSave={(dashboard) =>
  //     saveDashboard(dashboard.dashboardConfiguration)
  //   }
  // />
  return (
    <React.Fragment>
      <div className="dashboard">
        {query && client && (
          <React.Fragment>
            <div>{dashboardName}</div>
            <div>{dashboardDescription}</div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
