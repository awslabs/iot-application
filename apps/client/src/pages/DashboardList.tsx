import React, { useState, useEffect } from 'react';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import { Dashboard } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardsModule } from 'src/dashboards/dashboards.module';
import { Button } from '@cloudscape-design/components';

// TODO: create UX for setting dashboard name, description and definition
const DEFAULT_NAME = 'Default Name';
const DEFAULT_DESCRIPTION = 'Default Description';
const DEFAULT_DEFINITION = {
  widgets: [],
  viewport: { duration: '5m' },
};

const DashboardList: React.FC = () => {
  const dashboardsModule = new DashboardsModule();
  const [dashboards, setDashboards] = useState<Dashboard[]>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboards = async () => {
      const dashboardList = await dashboardsModule.http.list();
      setDashboards(dashboardList);
    };

    void fetchDashboards();
  }, []);

  const generateTableItems = () =>
    dashboards?.map((d) => ({
      ...d,
      link: <Link to={d.id}>{d.name}</Link>,
    }));

  const createDashboard = async () => {
    const dashboard = await dashboardsModule.http.create(
      DEFAULT_NAME,
      DEFAULT_DESCRIPTION,
      DEFAULT_DEFINITION,
    );
    navigate(`/dashboards/${dashboard.id}`);
  };

  return (
    <Table
      columnDefinitions={[
        {
          id: 'link',
          header: 'Dashboard',
          cell: (e) => e.link,
          sortingField: 'name',
        },
      ]}
      items={generateTableItems() ?? []}
      header={
        <Header
          actions={<Button onClick={createDashboard}>New dashboard</Button>}
        >
          Dashboards
        </Header>
      }
    />
  );
};

export default DashboardList;
