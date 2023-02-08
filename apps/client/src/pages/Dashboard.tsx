import * as React from 'react';
import { Link, useMatches } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const matches = useMatches();
  const dashboardId = matches[matches.length - 1]?.params.id;

  return (
    <div>
      <nav>
        <Link to={'/dashboards'}>Dashboard list</Link>
      </nav>
      <h1>dashboard view for {dashboardId}</h1>
    </div>
  );
};

export default Dashboard;
