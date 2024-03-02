import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/home/Home.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import About from './components/about/About.jsx'
import Services from './components/search/Services.jsx'
import Profile from './components/user/Profile.jsx'
import Chat from './components/chat/Chat.jsx'
import CreateService from './components/service/CreateService.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import Contracts from './components/contract/Contracts.jsx'
import Service from './components/service/Service.jsx'
import Root from './components/Root.jsx'
import ContractForm from './components/contract/ContractForm.jsx'


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
        path: 'auth',
        element: <Login />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'search',
        element: <Services />,
      },
      {
        path: 'service',
        element: <Service />,
      },
      {
        path: 'profile/:id',
        element: <Profile />,
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'service/create',
        element: <CreateService />,
      },
      {
        path:'contracts',
        element: <Contracts />,
      },
      {
        path: 'contracts/create',
        element: <ContractForm />,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
