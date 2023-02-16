import DashboardList from '../pages/DashboardList';
import Dashboard from '../pages/Dashboard';
import LoginForm from '../login/LoginForm';
import ErrorPage from '../pages/ErrorPage';
import App from '../pages/App';

const routes = [
  {
    path: '/login',
    element: <LoginForm />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/dashboards',
        element: <DashboardList />,
      },
      {
        path: '/dashboards/:id',
        element: <Dashboard />,
      },
    ],
  },
];

export default routes;
