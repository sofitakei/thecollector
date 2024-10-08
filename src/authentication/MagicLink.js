import { Button, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'

import { supabase } from '../supabaseClient'

const MagicLink = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  //const search = atob(location?.search?.substring(1)) || '{}'
  //TODO: add user to property if defined
  const handleLogin = async event => {
    event.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  return (
    <>
      <Typography mb={2}>
        An email will be sent to the address you provide below to sign in
      </Typography>
      <form onSubmit={handleLogin}>
        <Stack spacing={2}>
          <TextField
            type='email'
            placeholder='Your email'
            value={email}
            required={true}
            fullWidth
            onChange={e => setEmail(e.target.value.toLowerCase())}
          />

          <Button
            type='submit'
            fullWidth
            className='button block'
            disabled={loading}
            variant='contained'>
            {loading ? <span>Loading</span> : <span>Send magic link</span>}
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default MagicLink
