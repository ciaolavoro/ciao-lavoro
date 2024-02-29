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
import Root from './components/Root.jsx'
import Movies from './components/movies/Movies.jsx'
import Movie from './components/movies/Movie.jsx'
import Translation from './components/translation/Translation.jsx'

const movieOptions = {
  method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3d2ba4298fmsh27dfae92ac8622cp16eb18jsn97e0f6948e42',
		'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
	}
}

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
        path: 'profile/:id',
        element: <Profile />,
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      {
        path: 'movies',
        element: <Movies />,
        loader: async () => {
          return fetch('https://moviesdatabase.p.rapidapi.com/titles', movieOptions)
        },
        children: [
          {
            path: ':movieId',
            element: <Movie />,
            loader: async ({ params }) => {
              return fetch(`https://moviesdatabase.p.rapidapi.com/titles/${params.movieId}`, movieOptions)
            }
          }
        ]
      },
      {
        path: 'translation',
        element: <Translation />,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
