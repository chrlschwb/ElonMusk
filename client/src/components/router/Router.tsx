import { lazy, Suspense } from 'react';
import { BrowserRouter, Outlet, RouteObject, useRoutes } from 'react-router-dom';
import Loading from '~/components/shared/Loading';

const HomeScreen = lazy(() => import('~/components/screens/Home'));
const NotFoundScreen = lazy(() => import('~/components/screens/NotFound'));

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

function Routes() {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomeScreen />,
        },
        {
          path: '*',
          element: <NotFoundScreen />,
        },
      ],
    }

  ];
  const element = useRoutes(routes);

  return <Suspense fallback={<Loading />}>{element}</Suspense>;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}
