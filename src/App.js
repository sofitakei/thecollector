import './App.css'
import 'dayjs/locale/de'

import { LinearProgress } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import Routes from './AppRoutes'
import Login from './authentication/Login'
import AuthProvider from './contexts/AuthContext'
import { supabase } from './supabaseClient'
import Wall from './Wall'

const App = () => {
  const [session, setSession] = useState()
  const [verified, setVerified] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoading(false)
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
      {!verified && !localStorage.getItem('verified')
? (
        <Wall setVerified={setVerified} />
      )
: (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {loading
? (
            <LinearProgress />
          )
: (
            <AuthProvider setSession={setSession} session={session}>
              {session ? <Routes /> : <Login />}
            </AuthProvider>
          )}
        </LocalizationProvider>
      )}
    </ErrorBoundary>
  )
}

export default App
