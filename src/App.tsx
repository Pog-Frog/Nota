import { Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import { ThemeProvider, useTheme } from './context/ThemeProvider';
import CreatePostPage from './pages/CreatepostPage';
import ViewPostPage from './pages/ViewpostPage';
import PageNotFound from './pages/404Page';
import RegisterPage from './pages/RegisterPage';
import AuthLayout from './layouts/AuthLayout';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';


function App() {

  const { theme } = useTheme();

  return (
    <>
      <ThemeProvider defaultTheme='dark'>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path='*' element={<PageNotFound />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/create' element={<CreatePostPage />} />
            <Route path='/blog/:id' element={<ViewPostPage />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme === 'dark' ? 'dark' : 'light'}
        />
      </ThemeProvider>
    </>
  )
}

export default App
