import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/home/Home.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import Services from './components/service/Services.jsx'
import CreateService from './components/service/CreateService.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import Root from './components/Root.jsx'
import CreateContract from './components/contract/CreateContract.jsx'
import CreateJob from './components/service/CreateJob.jsx'
import Register from './components/register/Register.jsx'
import UserProfile from './components/user/UserProfile.jsx'
import Service from './components/service/Service.jsx'
import { AuthContextProvider } from './components/auth/AuthContextProvider.jsx'
import ContractUser from './components/contract/ContractUser.jsx'
import ServiceUser from './components/service/ServiceUser.jsx'

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;



const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: '/services/user',
        element: <ServiceUser />,
      },
      {
        path: 'services/:serviceId',
        element: <Service />,
        loader: async ({ params }) => {
          return fetch(`${BACKEND_URL}/service/${params.serviceId}`);
        },
      },
      {
        path: 'services/:serviceId/job/create',
        element: <CreateJob />,
        loader: async ({ params }) => {
          return fetch(`${BACKEND_URL}/service/${params.serviceId}/job/create`);
        },
      },
      {
        path: 'service/create',
        element: <CreateService />,
      },
      {
        path: 'contracts/create',
        element: <CreateContract />,
      },
      {
        path: 'contracts/mylist',
        element: <ContractUser />,
        },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'users/:userId',
        element: <UserProfile />,
        loader: async ({ params }) => {
          return fetch(`${BACKEND_URL}/user/${params.userId}`);
        },
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>,
)
