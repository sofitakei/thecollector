import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import AdminRoutes from './AdminRoutes'
import Login from './authentication/Login'
import Home from './Home'
import ContactUs from './info/ContactUs'
import FAQ from './info/FAQ'
import Pricing from './info/Pricing'
import Terms from './info/Terms'
import AnimatedLayout from './layout/AnimatedOutlet'
import PublicRoute from './PublicRoute'
import UserRoutes from './UserRoutes'

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route element={<AnimatedLayout />}>
        <Route element={<PublicRoute />}>
          <Route element={<Home />} exact path='/' />
          <Route element={<Login />} exact path='/login' />
          <Route element={<Terms />} path='/terms' />
          <Route element={<FAQ />} path='/faq' />
          <Route element={<Pricing />} path='/pricing' />
          <Route element={<ContactUs />} path='/contact-us' />
        </Route>
        <Route path='/*' element={<UserRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Route>
    </Routes>
  </Router>
)

export default AppRoutes
