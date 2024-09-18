import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useRef, useState } from 'react'

import MagicLink from './MagicLink'
import { supabase } from '../supabaseClient'

const Login = () => {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async e => {
    e.preventDefault()
    if (!passwordRef?.current?.value || !emailRef?.current?.value) {
      setErrorMsg('Please enter a username and password')
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
      if (error) {
        setErrorMsg('Error logging in')
      }
    }
  }

  return (
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
          <TextField label='email' inputRef={emailRef}></TextField>
          <TextField
            label='password'
            type='password'
            inputRef={passwordRef}></TextField>
          <Button type='submit' variant='outlined'>
            Login
          </Button>
        </Stack>
        <Typography>OR</Typography>
        <MagicLink />
      </Stack>
    </Box>
  )
}

export default Login
