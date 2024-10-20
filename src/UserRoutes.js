import { Navigate, Route, Routes } from 'react-router-dom'

import ResetPassword from './authentication/ResetPassword'
import { useAuth } from './contexts/AuthContext'
import AddMember from './members/AddMember'
import AllProfilesForManager from './members/AllProfilesForManager'
import InviteMember from './members/InviteMember'
import MemberProfile from './members/MemberProfile'
import MemberProfileForm from './members/MemberProfileForm'
import PreviouslyFiledMember from './members/PreviouslyFiledMember'
import PrivateRoute from './PrivateRoute'
import Profile from './Profile'
import Payment from './properties/Payment'
import PreviouslyFilledForms from './properties/PreviouslyFilledForms'
import Properties, { Property } from './properties/Properties'
import PropertyForm from './properties/PropertyForm'
import Settings from './Settings'

const UserRoutes = () => {
  const { userRole } = useAuth()
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route element={<ResetPassword />} path='/reset' />

        <Route element={<Profile />} exact path='/profile' />
        <Route element={<Settings />} exact path='/account' />
        <Route element={<Properties />} exact path='/properties' />
        {/* <Route element={<PaymentConfirmation />} path='/payment-confirmation' /> */}
        <Route element={<Property />} path='/properties/:propertyId' />
        <Route element={<PropertyForm />} path='/properties/:propertyId/edit' />
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
        <Route
          element={
            <Navigate
              replace
              to={userRole === 'admin' ? '/admin' : '/properties'}
            />
          }
          path='*'
        />
      </Route>
    </Routes>
  )
}

export default UserRoutes
