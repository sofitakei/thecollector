import { Outlet } from 'react-router-dom'

import HomeShell from './layout/HomeShell'

const PublicRoute = () => (
  <HomeShell>
    <Outlet />
  </HomeShell>
)

export default PublicRoute
