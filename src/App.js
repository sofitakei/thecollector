import './App.css'
import 'dayjs/locale/de'

import { LinearProgress, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import Routes from './AppRoutes'
import AuthProvider from './contexts/AuthContext'
import { supabase } from './supabaseClient'
import theme from './theme/theme'

const App = () => {
  const [session, setSession] = useState()
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
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {loading ? (
            <LinearProgress />
          ) : (
            <AuthProvider setSession={setSession} session={session}>
              <Routes />
            </AuthProvider>
          )}
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
