import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import AuthProvider from './contexts/AuthContext'
import PrivateRoute from './PrivateRoute'
import AddMember from './members/AddMember'
import InviteMember from './members/InviteMember'
import MemberProfile from './members/MemberProfile'
import MemberProfileForm from './members/MemberProfileForm'
import PreviouslyFilledForms from './properties/PreviouslyFilledForms'
import Properties, { Property } from './properties/Properties'
import PropertyForm from './properties/PropertyForm'
import ResetPassword from './authentication/ResetPassword'
import AllProfilesForManager from './members/AllProfilesForManager'
import Payment from './properties/Payment'
import PreviouslyFiledMember from './members/PreviouslyFiledMember'
import Profile from './Profile'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<ResetPassword />} path='/reset' />
        <Route element={<PrivateRoute />}>
          <Route element={<Profile />} exact path='/profile' />

          <Route element={<Properties />} exact path='/properties' />
          <Route element={<Property />} path='/properties/:propertyId' />
          <Route
            element={<PropertyForm />}
            path='/properties/:propertyId/edit'
          />
          <Route
            element={<InviteMember />}
            path='/properties/:propertyId/invite'
          />
          <Route
            element={<AddMember />}
            path='/properties/:propertyId/addMembers'
          />
          <Route element={<Payment />} path='/properties/:propertyId/payment' />
          <Route
            element={<PreviouslyFilledForms />}
            path='/properties/:propertyId/history'
          />
          <Route
            element={<PreviouslyFiledMember />}
            path='/properties/:propertyId/history/:fileId'
          />
          <Route
            element={<MemberProfile />}
            path='/properties/:propertyId/users/:userId'
          />
          <Route
            element={<MemberProfileForm />}
            path='/properties/:propertyId/users/:userId/edit'
          />
          <Route
            element={<AllProfilesForManager />}
            path='/properties/:propertyId/submit'
          />
          <Route element={<Navigate replace to='/properties' />} path='*' />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes
