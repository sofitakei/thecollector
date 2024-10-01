import { useRef, useState } from 'react'

import { supabase } from './supabaseClient'
import {
  Alert,
  Button,
  Divider,
  LinearProgress,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Form from './components/Form'
import { useAuth } from './contexts/AuthContext'
import { getFormFields } from './utils'
import LoadingBackdrop from './components/LoadingBackdrop'
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
  const [loading, setLoading] = useState(false)
  const [successfulSave, setSuccessfulSave] = useState()
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const formFields = getFormFields(e.target)
    const { error, status } = await supabase
      .from('profiles')
      .update(formFields)
      .eq('id', userProfile?.id)
    setLoading(false)
    setSuccessfulSave(status === 204)
    setError(error)
  }

  return (
    <>
      <LoadingBackdrop open={loading} />
      {successfulSave && (
        <Snackbar
          open
          autoHideDuration={5000}
          message='Profile saved'
          onClose={() => setSuccessfulSave(false)}>
          <Alert
            onClose={() => setSuccessfulSave(false)}
            severity='success'
            variant='filled'
            sx={{ width: '100%' }}>
            Profile saved!
          </Alert>
        </Snackbar>
      )}
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
    </>
  )
}

export default Profile
