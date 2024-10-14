import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from './contexts/AuthContext'
import NavShell from './layout/NavShell'

const AdminRoute = () => {
  const { session, userRole } = useAuth()
  if (!session?.user) return <Navigate to='/login' />
  if (userRole !== 'admin') return <Navigate to='/properties' />
  return (
    <NavShell>
      <Outlet />
    </NavShell>
  )
}

export default AdminRoute
