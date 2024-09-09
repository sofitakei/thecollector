import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext({})

const AuthProvider = ({ children, session }) => {
  const [userProfile, setUserProfile] = useState({})

  const logout = () => supabase.auth.signOut()

  useEffect(() => {
    const getUserData = async id => {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('auth_user_id', id)

      //TODO: do this on the db as a trigger
      if (!data.length) {
        const { data: existingUser, error } = await supabase
          .from('profiles')
          .select()
          .eq('email', session.user.email)
        if (!error && existingUser.length && !existingUser[0].auth_user_id) {
          const { data: user } = await supabase
            .from('profiles')
            .update({ auth_user_id: session.user.id })
            .eq('id', existingUser[0].id)
          setUserProfile(user[0])
        }
      } else {
        setUserProfile(data[0])
      }
    }

    if (session?.user?.id) {
      getUserData(session.user.id)
    }
  }, [session?.user?.id])

  return (
    <AuthContext.Provider
      value={{ user: session?.user, userProfile, logout, session }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
