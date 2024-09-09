import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from './contexts/AuthContext'
import PropertiesProvider from './contexts/PropertiesContext'
import NavShell from './layout/NavShell'

const PrivateRoute = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to='/login' />
  if (!user.user_metadata.has_password) return <Navigate to='/reset' />
  return (
    <PropertiesProvider>
      <NavShell>
        <Outlet />
      </NavShell>
    </PropertiesProvider>
  )
}

export default PrivateRoute
