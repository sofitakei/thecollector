import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { usePropertyContext } from '../contexts/PropertyContext'
import { supabase } from '../supabaseClient'
import { getFormFields } from '../utils'

const products = [
  { name: 'base', label: 'Base Level' },
  { name: 'mid', label: 'Mid Level' },
  { name: 'full', label: 'Full Service' },
]
const MarkAsPaid = () => {
  const { userRole, userProfile } = useAuth()
  const { propertyId } = useParams()
  const { filing, setFiling } = usePropertyContext() || {}
  const [open, setOpen] = useState(false)

  const handleConfirmPayment = async e => {
    e.preventDefault()
    const fields = getFormFields(e.target)
    const { data, error } = await supabase.rpc('create_filing_with_payment', {
      created_by_user_id: userProfile?.id,
      amount: fields.amount,
      service_level: fields.service,
      status: 'paid',
      method: 'manual',
      property_id: propertyId,
    })
    setOpen(false)
    setFiling(data[0])
  }

  const handleMarkAsPaid = () => {
    setOpen(true)
  }

  return userRole === 'admin' && !filing?.payment_id ? (
    <>
      <Button
        onClick={handleMarkAsPaid}
        sx={{ mt: 3 }}
        variant='contained'
        color='secondary'>
        Mark as paid
      </Button>
      <Dialog open={open}>
        <DialogTitle>Mark Payment Complete</DialogTitle>
        <Box component='form' onSubmit={handleConfirmPayment}>
          <DialogContent>
            <TextField type='number' label='Amount' name='amount' />
            <br />
            <FormControl>
              <FormLabel id='role-radio-buttons-group-label'>Service</FormLabel>
              <RadioGroup
                aria-labelledby='role-radio-buttons-group-label'
                name='service'
                required>
                {products.map(({ name, label }) => (
                  <FormControlLabel
                    control={<Radio />}
                    key={name}
                    value={name}
                    label={label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false)
              }}>
              Cancel
            </Button>
            <Button type='submit'>Yes</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  ) : null
}

export default MarkAsPaid
