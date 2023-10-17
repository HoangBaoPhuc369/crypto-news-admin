/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/order */
import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import UserNew from './pages/UserNew';
import Post from './pages/Post';
import PostNew from './pages/PostNew';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Category from './pages/Category';
import CategoryNew from './pages/CategoryNew';
import Social from './pages/Social';
import SocialNew from './pages/SocialNew';
import PostEdit from './pages/PostEdit';

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useSelector((state) => state.auth);

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: Boolean(_.get(user, 'token')) ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'user/new', element: <UserNew /> },
        { path: 'post', element: <Post /> },
        { path: 'post/new', element: <PostNew /> },
        { path: 'post/edit/:id/local/:local', element: <PostEdit /> },
        { path: 'category', element: <Category /> },
        { path: 'category/new', element: <CategoryNew /> },
        { path: 'social', element: <Social /> },
        { path: 'social/new', element: <SocialNew /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
      index: true,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
