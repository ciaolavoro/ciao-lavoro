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
import ErrorPage from './components/ErrorPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth',
    element: <Login />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/search',
    element: <Services />,
  },
  {
    path: '/profile/:id',
    element: <Profile />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
