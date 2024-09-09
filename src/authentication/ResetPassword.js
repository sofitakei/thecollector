import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const passwordRef = useRef(null)
  const navigate = useNavigate()

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({
      password: passwordRef?.current?.value,
      data: {
        has_password: true,
      },
    })
    console.log({ error })
    if (!error) {
      navigate('/')
    }
  }

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
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
