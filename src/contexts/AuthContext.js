import { jwtDecode } from 'jwt-decode'
import PropTypes from 'prop-types'
import { createContext, useContext, useEffect, useState } from 'react'

import { useData } from '../hooks/useData'
import { supabase } from '../supabaseClient'

const AuthContext = createContext({})

const AuthProvider = ({ children, session, setSession }) => {
  const [userProfile, setUserProfile] = useState({})

  const logout = () => supabase.auth.signOut()

  const jwt = session ? jwtDecode(session.access_token) : {}

  const userRole = jwt.user_role

  const getUserData = async () =>
    await supabase
      .from('profiles')
      .select()
      .eq('auth_user_id', session?.user?.id)

  const onSuccess = data => {
    setUserProfile({ ...data[0], email: session?.user?.email })
  }

  const { refresh, setRefresh } = useData({
    supabaseFn: getUserData,
    onSuccess,
  })

  useEffect(() => {
    if (session?.user?.id && !userProfile?.id) {
      setRefresh(true)
    }
  }, [session?.user?.id, refresh, setRefresh, userProfile])

  return (
    <AuthContext.Provider
      value={{
        user: session?.user,
        userProfile,
        userRole,
        logout,
        session,
        setRefresh,
        setSession,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.object,
  session: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string,
    }),
  }),
  setSession: PropTypes.func,
}
export const useAuth = () => useContext(AuthContext)

export default AuthProvider
