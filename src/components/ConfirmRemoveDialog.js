import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import PropTypes from 'prop-types'
import { supabase } from '../supabaseClient'
import { usePropertiesContext } from '../contexts/PropertiesContext'

const ConfirmRemoveDialog = ({
  getter = ({ name }) => name,
  items,
  setOpen,
}) => {
  const { setRefresh } = usePropertiesContext()
  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = async () => {
    const response = await supabase
      .from('properties')
      .delete()
      .in(
        'id',
        items.map(item => item.id)
      )
    setOpen(false)
    setRefresh(true)
  }

  return (
    <Dialog open>
      <DialogTitle>Confirm Removal</DialogTitle>
      <DialogContent>
        Are you sure you want to remove the following?
        <ul>
          {items.map(item => (
            <li key={item.id}>{getter(item)}</li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete}>Yes</Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmRemoveDialog.propTypes = {
  getter: PropTypes.func,
  items: PropTypes.array.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default ConfirmRemoveDialog
