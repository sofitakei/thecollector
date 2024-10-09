import {
  Alert,
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useRef, useState } from 'react'

import { supabase } from '../supabaseClient'
import ForgotPassword from './ForgotPassword'
import MagicLink from './MagicLink'

const LOGIN = 'login'

const Login = () => {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [pageState, setPageState] = useState(LOGIN)
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

  return pageState === LOGIN
? (
    <Box
      sx={{
        px: 5,
        my: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '100vw',
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
  )
: (
    <ForgotPassword />
  )
}

export default Login
