import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useData } from '../hooks/useData'
import { setRef } from '@mui/material'

const AuthContext = createContext({})

const AuthProvider = ({ children, session }) => {
  const [userProfile, setUserProfile] = useState({})
  const logout = () => supabase.auth.signOut()

  const getUserData = async () => {
    return await supabase
      .from('profiles')
      .select()
      .eq('auth_user_id', session?.user?.id)
    //TODO: if we don't find a user profile?
  }

  const onSuccess = data => {
    setUserProfile(data[0])
  }

  const { refresh, setRefresh } = useData({
    supabaseFn: getUserData,
    onSuccess,
  })

  useEffect(() => {
    if (session?.user?.id) {
      setRefresh(true)
    }
  }, [session?.user?.id, refresh])

  return (
    <AuthContext.Provider
      value={{ user: session?.user, userProfile, logout, session, setRefresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
