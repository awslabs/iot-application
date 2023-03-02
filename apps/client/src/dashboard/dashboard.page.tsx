import { useMatches } from 'react-router-dom';

export const DashboardPage = () => {
  const matches = useMatches();
  const dashboardId = matches[matches.length - 1]?.params.id;

  return <h1>dashboard view for {dashboardId}</h1>;
};
