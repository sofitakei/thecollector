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
import { useEffect, useRef, useState } from 'react'

import { useAuth } from '../contexts/AuthContext'

import MagicLink from './MagicLink'
import { supabase } from '../supabaseClient'

const Login = () => {
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailRef?.current?.value,
      password: passwordRef?.current?.value,
    })
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      {errorMsg && (
        <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>
          {errorMsg}
        </Alert>
      )}
      <Typography component='h1' variant='h5' mb={2}>
        Sign in
      </Typography>
      <Stack spacing={2}>
        <TextField label='email' inputRef={emailRef}></TextField>
        <TextField
          label='password'
          type='password'
          inputRef={passwordRef}></TextField>
        <Button variant='outlined' onClick={handleLogin}>
          Login
        </Button>
        <Typography>OR</Typography>
        <MagicLink />
      </Stack>
    </Box>
  )
}

export default Login
