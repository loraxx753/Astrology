/* eslint-disable @typescript-eslint/no-unused-vars */
import { Theme } from '@radix-ui/themes';
import './styles/globals.css'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import * as pages from './components/Pages';
import { Layout } from './components/Layout';
import { NotFoundBoundary } from './components/NotFoundBoundary';

/**
 * Router documentation https://reactrouter.com/en/main/routers/create-browser-router
 */
const pageRoutes = Object.entries(pages).map(([_, Element]) => ({
  ...Element,
  element: (
    <Layout>
      <Element />
    </Layout>
  ),
}));

// Add catch-all 404 route
pageRoutes.push({
  path: '*',
  element: <NotFoundBoundary />,
});

const router = createBrowserRouter(pageRoutes);


function App() {
  return (
    <Theme className='flex justify-center' accentColor="crimson" grayColor="sand" radius="large" scaling="100%" style={{width: '100%', overflow: 'hidden'}}>
      <RouterProvider router={router} />
    </Theme>
  )
}

export default App
