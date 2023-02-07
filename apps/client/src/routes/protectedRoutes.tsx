import Login from '../pages/Login';
import ErrorPage from '../pages/ErrorPage';
import routes from './routes'

const protectedRoutes = [
  {
    path: '/',
    element: <Login/>,
    errorElement: <ErrorPage/>,
    children: routes,
  },
];

export default protectedRoutes;
