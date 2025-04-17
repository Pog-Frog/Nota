import { Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import { ThemeProvider } from './context/ThemeProvider';
import CreatePostPage from './pages/CreatepostPage';
import ViewPostPage from './pages/ViewpostPage';
import PageNotFound from './pages/404Page';
import RegisterPage from './pages/RegisterPage';
import AuthLayout from './layouts/AuthLayout';

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
          <Route element={<AuthLayout />}>
            <Route path="/register" element={<RegisterPage />} />
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
          theme="light"
          progressStyle={{ backgroundColor: "#ea580c" }}
        />
      </ThemeProvider>
    </>
  )
}

export default App
