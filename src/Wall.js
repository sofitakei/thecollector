import { Alert, Button, Stack, TextField, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'

import { supabase } from './supabaseClient'

//TODO: this is not secure but will eventually be removed
const Wall = ({ setVerified }) => {
  const ref = useRef()
  const [error, setError] = useState()

  const handleClick = async () => {
    setError('')
    const { data, error } = await supabase.functions.invoke('verify-key', {
      body: { password: ref?.current?.value, name: 'yay' },
    })
    if (error || !data?.verified) {
      setError('access not granted')
    } else {
      setVerified(true)
      localStorage.setItem('verified', true)
    }
  }

  return (
    <Stack sx={{ alignItems: 'center' }} spacing={3}>
      {error && <Alert severity='error'>{error}</Alert>}
      <Typography variant='h1'>Coming Soon!</Typography>
      <Typography variant='h4'>Preview with key:</Typography>
      <TextField type='password' inputRef={ref} />
      <Button variant='outlined' onClick={handleClick}>
        let me in
      </Button>
    </Stack>
  )
}

Wall.propTypes = {
  setVerified: PropTypes.func.isRequired,
}

export default Wall
