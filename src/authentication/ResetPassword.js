import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useRef, useState } from 'react'

import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const passwordRef = useRef(null)
  const navigate = useNavigate()
  const [success, setSuccess] = useState()
  const handleReset = async () => {
    const { data, error } = await supabase.auth.updateUser({
      password: passwordRef?.current?.value,
      data: {
        has_password: true,
      },
    })
    console.log({ data, error })
    if (error === null) {
      setSuccess(true)
      navigate('/properties')
    }
  }

  return (
    <Box sx={{ alignItems: 'center' }}>
      <Typography component='h1' variant='h5' mb={2}>
        Set New Password
      </Typography>
      <Stack spacing={2}>
        {success && (
          <Alert severity='info'>
            Password set! Use this to log in in the future.
            <Link to='/properties'>Click here</Link> to continue
          </Alert>
        )}
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
