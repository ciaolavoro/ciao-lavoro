import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/home/Home.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login.jsx'
import About from './components/about/About.jsx'
import Services from './components/service/Services.jsx'
import CreateService from './components/service/CreateService.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import Contracts from './components/contract/Contracts.jsx'
import Root from './components/Root.jsx'
import CreateContract from './components/contract/CreateContract.jsx'
import { AuthContextProvider } from './components/auth/AuthContextProvider.jsx'

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
        path: 'about',
        element: <About />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'service/create',
        element: <CreateService />,
      },
      {
        path: 'contracts',
        element: <Contracts />,
      },
      {
        path: 'contracts/create',
        element: <CreateContract />,
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
