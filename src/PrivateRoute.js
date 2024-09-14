import { Navigate, Outlet, useParams } from 'react-router-dom'

import { useAuth } from './contexts/AuthContext'
import PropertiesProvider from './contexts/PropertiesContext'
import NavShell from './layout/NavShell'
import PropertyProvider from './contexts/PropertyContext'

const wrapProvider = (wrap, Provider, children) =>
  wrap ? <Provider>{children}</Provider> : children

const PrivateRoute = () => {
  const { session } = useAuth()
  const { propertyId } = useParams()
  if (!session?.user) return <Navigate to='/login' />
  if (!session?.user?.user_metadata.has_password)
    return <Navigate to='/reset' />
  return (
    <PropertiesProvider>
      {wrapProvider(
        propertyId && propertyId !== 'new',
        PropertyProvider,
        <NavShell>
          <Outlet />
        </NavShell>
      )}
    </PropertiesProvider>
  )
}

export default PrivateRoute
