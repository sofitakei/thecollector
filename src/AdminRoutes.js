import { Route, Routes } from 'react-router-dom'

import AdminHome from './admin/AdminHome'
import Filed from './admin/Filed'
import NeedsFiling from './admin/NeedsFiling'
import AdminRoute from './AdminRoute'

const AdminRoutes = () => (
  <Routes>
    <Route element={<AdminRoute />}>
      <Route element={<AdminHome />} path='/' />
      <Route element={<NeedsFiling />} path='needs-filing' />
      <Route element={<Filed />} path='filed' />
    </Route>
  </Routes>
)

export default AdminRoutes
