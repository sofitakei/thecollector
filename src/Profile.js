import { useRef, useState } from 'react'

import { supabase } from './supabaseClient'
import {
  Alert,
  Button,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Form from './components/Form'
import { useAuth } from './contexts/AuthContext'
import { getFormFields } from './utils'
const fields = [
  {
    name: 'last_name',
    label: 'Last Name',
  },
  { name: 'first_name', label: 'First Name' },
  { name: 'middle_name', label: 'Middle Name' },
  { name: 'suffix', label: 'Suffix' },
]

const Profile = () => {
  const ref = useRef()
  const [error, setError] = useState()
  const { userProfile, user } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()
    const formFields = getFormFields(e.target)
    return await supabase
      .from('profiles')
      .update(formFields)
      .eq('id', userProfile?.id)
  }

  const handleAccountSubmit = async e => {
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

    const { data, error } = await supabase.auth.updateUser(submitFields)
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
      {error && <Alert severity='error'>{error}</Alert>}
      <Typography variant='h4'>My Profile</Typography>
      {userProfile?.email ? (
        <>
          <Form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {fields.map(field => (
                <TextField
                  key={field.name}
                  fullWidth
                  defaultValue={userProfile?.[field.name]}
                  {...field}
                />
              ))}
            </Stack>
          </Form>
          <Typography variant='h4'>My Account</Typography>
          <Form
            onSubmit={handleAccountSubmit}
            buttonLabel='Save Account Settings'>
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
      ) : (
        <LinearProgress />
      )}
    </Stack>
  )
}

export default Profile
