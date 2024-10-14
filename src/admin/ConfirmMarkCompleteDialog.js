import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import PropTypes from 'prop-types'

const ConfirmMarkCompleteDialog = ({
  propertyName,
  setProperty,
  onConfirmAction,
  open,
}) => {
  const handleClose = () => {
    setProperty(null)
  }
  const handleConfirmAction = async () => {
    setProperty(null)
    await onConfirmAction()
    //TODO: error handling
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Marking {propertyName} as complete</DialogTitle>
      <DialogContent>
        You are about to mark the filing as submitted.
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirmAction}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmMarkCompleteDialog.propTypes = {
  onConfirmAction: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setProperty: PropTypes.func.isRequired,
  propertyName: PropTypes.string.isRequired,
}

export default ConfirmMarkCompleteDialog
