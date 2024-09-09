import { useEffect, useState } from 'react'
import './App.css'

import Routes from './AppRoutes'
import { supabase } from './supabaseClient'
import Login from './authentication/Login'
import AuthProvider from './contexts/AuthContext'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/de'
import { ErrorBoundary } from 'react-error-boundary'

const App = () => {
  const [session, setSession] = useState()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setSession(session)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
      }
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  return (
    <ErrorBoundary>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider session={session}>
          {session ? <Routes /> : <Login />}
        </AuthProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  )
}

export default App
