import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useRef, useState } from 'react'

import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ResetPassword = () => {
  const passwordRef = useRef(null)
  const navigate = useNavigate()
  const [success, setSuccess] = useState()
  const { setSession } = useAuth()
  const handleReset = async () => {
    const { data, error } = await supabase.auth.updateUser({
      password: passwordRef?.current?.value,
    })

    if (error === null) {
      const { data } = await supabase.auth.refreshSession()
      const { session } = data
      setSession(session)
      navigate('/')
    }
  }

  return (
    <Box sx={{ alignItems: 'center' }}>
      <Typography component='h1' variant='h5' mb={2}>
        Set New Password
      </Typography>
      <Stack spacing={2}>
        <TextField
          type='password'
          fullWidth
          label='password'
          inputRef={passwordRef}></TextField>
        <Button variant='contained' onClick={handleReset}>
          Save Password
        </Button>
      </Stack>
    </Box>
  )
}

export default ResetPassword
