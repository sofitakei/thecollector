import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AdminRoutes from './AdminRoutes'
import UserRoutes from './UserRoutes'

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path='/*' element={<UserRoutes />} />
      <Route path='/admin/*' element={<AdminRoutes />} />
    </Routes>
  </Router>
)

export default AppRoutes
