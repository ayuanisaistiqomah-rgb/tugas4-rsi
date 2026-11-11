import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import StallList from './pages/StallList'
import StallDetail from './pages/StallDetail'
import StallForm from './pages/StallForm'
import Login from './pages/Login'
import Register from './pages/Register'
import { Forbidden, NotFound } from './pages/Forbidden'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-sun-soft text-text">
          <Navbar />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
            <Routes>
              <Route path="/" element={<StallList />} />
              <Route path="/stalls/:id" element={<StallDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<ProtectedRoute roles={['admin', 'owner']} />}>
                <Route path="/stalls/new" element={<StallForm />} />
                <Route path="/stalls/:id/edit" element={<StallForm />} />
              </Route>

              <Route path="/forbidden" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App