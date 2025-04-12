import { Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import { ThemeProvider } from './context/ThemeProvider';

function App() {
  return (
    <>
      <ThemeProvider defaultTheme='dark'>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path='/' element={<HomePage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
