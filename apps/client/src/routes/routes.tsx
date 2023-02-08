import DashboardList from '../pages/DashboardList';
import Dashboard from '../pages/Dashboard';

const routes = [
  {
    path: '/dashboards',
    element: <DashboardList />,
  },
  {
    path: '/dashboards/:id',
    element: <Dashboard />,
  },
];

export default routes;
