import LoginForm from '../login/LoginForm';
import ErrorPage from '../pages/ErrorPage';
import routes from './routes';

// Temporarily disable protected routes.
// TO-DO: put routes behind authentication.
const protectedRoutes = [
  {
    path: '/',
    element: <LoginForm />,
    errorElement: <ErrorPage />,
  },
  ...routes,
];

export default protectedRoutes;
