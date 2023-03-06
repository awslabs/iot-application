import { useMatches } from 'react-router-dom';
import { useDashboardQuery } from './dashboards.hook';

export const DashboardPage = () => {
  const matches = useMatches();
  const dashboardId = matches[matches.length - 1]!.params.id!;

  const { data: dashboard } = useDashboardQuery(dashboardId);

  console.log(dashboard);

  return <h1>dashboard view for {dashboard?.id}</h1>;
};
