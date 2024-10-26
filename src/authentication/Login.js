import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import ForgotPassword from './ForgotPassword'
import MagicLink from './MagicLink'

const LOGIN = 'login'

const Login = () => {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const { session } = useAuth()
  const [errorMsg, setErrorMsg] = useState('')
  const [pageState, setPageState] = useState(LOGIN)
  const navigate = useNavigate()
  const handleLogin = async e => {
    e.preventDefault()
    if (!passwordRef?.current?.value || !emailRef?.current?.value) {
      setErrorMsg('Please enter a username and password')
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      if (error) {
        setErrorMsg('Error logging in')
      }
    }
  }

  useEffect(() => {
    console.log('log in user ', session?.user?.id)
    if (session?.user?.id) {
      navigate('/properties')
    }
  }, [navigate, session?.user?.id])

  return pageState === LOGIN ? (
    <Box
      sx={{
        px: 5,
        my: 5,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: { xs: '100vw', md: '50%' },
      }}>
      {errorMsg && (
        <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>
          {errorMsg}
        </Alert>
      )}
      <Typography component='h1' variant='h5' mb={2}>
        Sign in
      </Typography>
      <Stack width='100%' spacing={2}>
        <Stack spacing={2} component='form' onSubmit={handleLogin}>
          <TextField label='email' inputRef={emailRef} />
          <TextField label='password' type='password' inputRef={passwordRef} />
          <Button type='submit' variant='outlined'>
            Login
          </Button>
          <Link onClick={() => setPageState('forgot')}>Forgot password?</Link>
        </Stack>
        <Typography>OR</Typography>
        <MagicLink />
      </Stack>
    </Box>
  ) : (
    <ForgotPassword />
  )
}

export default Login
