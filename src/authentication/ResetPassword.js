import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import { useRef, useState } from 'react'

import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ResetPassword = () => {
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  const navigate = useNavigate()
  const [error, setError] = useState()
  const { setSession } = useAuth()
  const handleReset = async () => {
    setError(null)
    if (passwordRef?.current?.value !== confirmPasswordRef?.current?.value) {
      alert('Passwords must match')
      return
    }
    if (!passwordRef?.current?.value) {
      alert('Please provide a password')
      return
    }
    const { error } = await supabase.auth.updateUser({
      password: passwordRef?.current?.value,
    })

    if (error === null) {
      const { data } = await supabase.auth.refreshSession()
      const { session } = data
      setSession(session)
      navigate('/')
    } else {
      setError(error?.message)
    }
  }

  return (
    <Stack spacing={2} alignItems='center' justifyContent='center'>
      {error && <Alert severity='error'>{error}</Alert>}
      <Typography component='h1' variant='h5' mb={2}>
        Set New Password
      </Typography>
      <TextField
        type='password'
        label='Password'
        inputRef={passwordRef}></TextField>
      <TextField
        type='password'
        label='Confirm Password'
        inputRef={confirmPasswordRef}></TextField>
      <Button variant='contained' onClick={handleReset}>
        Save Password
      </Button>
    </Stack>
  )
}

export default ResetPassword
