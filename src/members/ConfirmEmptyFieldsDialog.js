import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import PropTypes from 'prop-types'

const ConfirmEmptyFieldsDialog = ({
  items,
  setOpen,
  onConfirmAction,
  open,
}) => {
  const handleClose = () => {
    setOpen(false)
  }
  const handleConfirmAction = async () => {
    setOpen(false)
    await onConfirmAction()
    //TODO: error handling
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Required Fields Missing</DialogTitle>
      <DialogContent>
        The following fields are required and will need to be filled in before
        submission.
        <ul>
          {items.map(item => (
            <li key={item.name}>{item.label}</li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirmAction}>Save anyway</Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmEmptyFieldsDialog.propTypes = {
  items: PropTypes.array.isRequired,
  onConfirmAction: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default ConfirmEmptyFieldsDialog
