import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Header from '../components/Header'
import Dashboard from '../pages/Dashboard'
import GroupDetails from '../pages/GroupDetails'
import Reveal from '../pages/Reveal'
import PrivateRoute from '../components/PrivateRoute'
import Account from '../pages/Account'

function AppRoutes() {
  
  return (
    <BrowserRouter>

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      <Route
        path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      <Route
        path="/group/:id"
        element={
          <PrivateRoute>
            <GroupDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/minha-conta"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      />
      <Route
        path="/reveal/:token"
        element={<Reveal />}
      />
      <Route
        path="/recuperar-senha"
        element={<ForgotPassword />}
      />
      <Route path="/redefinir-senha" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
