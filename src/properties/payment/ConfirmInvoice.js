import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '../../contexts/AuthContext'
import { usePropertyContext } from '../../contexts/PropertyContext'
import { supabase } from '../../supabaseClient'

const ConfirmInvoiceDialog = ({ product, open, onClose }) => {
  const [processing, setProcessing] = useState()
  const [processed, setProcessed] = useState()

  const { user, userProfile } = useAuth()
  const { filing } = usePropertyContext()
  console.log({ filing })
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const handleDone = () => {
    navigate(`/properties/property/${propertyId}`)
  }

  const handleClose = () => {
    setProcessing(false)
    setProcessed(false)
    onClose()
  }

  const handleConfirmAction = async () => {
    setProcessing(true)
    setProcessed(false)

    await supabase.functions.invoke('stripe-create-invoice', {
      body: {
        priceId: product?.id,
        product: product.product,
        filing_id: filing?.id,
        user_id: userProfile?.id,
      },
    })
    setProcessing(false)
    setProcessed(true)
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Send Invoice</DialogTitle>
      <DialogContent>
        {processing ? (
          <CircularProgress />
        ) : processed ? (
          <div>
            Your invoice has been successfully generated and will be delivered
            via email.
          </div>
        ) : (
          <div>
            You are about to create an invoice for
            <strong> {product?.product?.name}</strong>. It will be e-mailed to{' '}
            <strong>{user?.email}</strong>.
          </div>
        )}
      </DialogContent>
      <DialogActions>
        {processed ? (
          <Button variant='contained' onClick={handleDone}>
            Done
          </Button>
        ) : (
          <>
            <Button disabled={processing} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              disabled={processing}
              variant='contained'
              onClick={handleConfirmAction}>
              Confirm
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmInvoiceDialog
