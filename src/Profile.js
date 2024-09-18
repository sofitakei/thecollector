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

  return (
    <Stack sx={{ alignItems: 'center', form: { width: '100%' } }} spacing={3}>
      {error && <Alert severity='error'>{error}</Alert>}
      <Typography variant='h4'>My Profile</Typography>
      {userProfile?.email ? (
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
      ) : (
        <LinearProgress />
      )}
    </Stack>
  )
}

export default Profile
