import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useRef } from 'react'

import { supabase } from '../supabaseClient'

const ForgotPassword = () => {
  const emailRef = useRef(null)

  const handleReset = async e => {
    e.preventDefault()
    const { error } = await supabase.auth.resetPasswordForEmail(
      emailRef?.current?.value,
      { redirectTo: location.origin + '/reset' }
    )

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('A password has been sent if the email account exists.')
    }
  }

  return (
    <Box sx={{ alignItems: 'center' }}>
      <Typography component='h1' variant='h5' mb={2}>
        Enter the email you used for your login:
      </Typography>
      <Stack spacing={2}>
        <TextField fullWidth label='email' inputRef={emailRef}></TextField>
        <Button variant='contained' onClick={handleReset}>
          Send Reset Link
        </Button>
      </Stack>
    </Box>
  )
}

export default ForgotPassword
