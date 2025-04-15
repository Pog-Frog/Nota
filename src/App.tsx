import { Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import { ThemeProvider } from './context/ThemeProvider';
import CreatePostPage from './pages/CreatepostPage';
import ViewPostPage from './pages/ViewpostPage';
import PageNotFound from './pages/404Page';

function App() {
  return (
    <>
      <ThemeProvider defaultTheme='dark'>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path='*' element={<PageNotFound />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/create' element={<CreatePostPage />} />
            <Route path='/blog' element={<ViewPostPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
