import {
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import Form from './components/Form'
import { useAuth } from './contexts/AuthContext'
import { supabase } from './supabaseClient'
import { getFormFields } from './utils'

const Settings = () => {
  const { userProfile, user } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()
    const formFields = getFormFields(e.target)
    const changeEmail = formFields.email !== user.email
    if (
      formFields.password &&
      formFields.password !== formFields.confirmpassword
    ) {
      alert('Passwords do not match')
      return
    }
    if (!formFields.password && !changeEmail) {
      alert('No changes')
      return
    }
    if (!formFields.email) {
      alert('Email is required.')
    }

    const submitFields = formFields.password
      ? { password: formFields.password, email: formFields.email }
      : { email: formFields.email }

    await supabase.auth.updateUser(submitFields)
    if (changeEmail) {
      alert(
        'A confirmation link has been sent to your new email.  Click the link to confirm this email change.'
      )
    } else {
      alert('Password successfully changed.')
    }
  }
  return (
    <Stack sx={{ alignItems: 'center', form: { width: '100%' } }} spacing={3}>
      {userProfile?.email
? (
        <>
          <Typography variant='h4'>My Account</Typography>
          <Form onSubmit={handleSubmit} buttonLabel='Save Account Settings'>
            <Stack spacing={3}>
              <TextField label='Email' name='email' defaultValue={user.email} />
              <TextField label='Password' name='password' type='password' />
              <TextField
                label='Confirm Password'
                name='confirmpassword'
                type='password'
              />
            </Stack>
          </Form>
        </>
      )
: (
        <LinearProgress />
      )}
    </Stack>
  )
}

export default Settings
