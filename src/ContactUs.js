import { Stack, TextField, Typography } from '@mui/material'

import Form from './components/Form'
import { getFormFields } from './utils'

const ContactUs = () => {
  const handleSubmit = e => {
    e.preventDefault()
    const fields = getFormFields(e.target)
    console.log({ fields })
  }
  return (
    <>
      <Typography variant='h4'>Contact Us</Typography>
      <p>Fill out the form below to contact us further</p>
      <Stack
        my={4}
        mx='auto'
        sx={{
          width: {
            xs: '100vw',
            md: '60vw',
          },
          textAlign: 'left',
          '.MuiFormControl-root': { marginBottom: 2 },
        }}>
        <Form onSubmit={handleSubmit} buttonLabel='Send'>
          <TextField name='email' label='Your Email' fullWidth required />
          <TextField
            name='message'
            label='Your comments'
            fullWidth
            multiline
            required
            minRows={10}
            maxRows={10}
          />
        </Form>
      </Stack>
    </>
  )
}

export default ContactUs
