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
import { usePropertyContext } from '../contexts/PropertyContext'

const ConfirmRemoveDialog = ({
  table = 'properties',
  idField = 'property_id',
  getter = ({ name }) => name,
  items,
  setOpen,
}) => {
  const { setRefresh } = usePropertiesContext()
  const { setRefresh: setPropertyRefresh } = usePropertyContext()
  const handleClose = () => {
    setOpen(false)
  }
  const handleDelete = async () => {
    console.log(items)
    const response = await supabase
      .from(table)
      .update({ deleted: new Date().toISOString() })
      .in(
        'id',
        items.map(item => item[idField])
      )
    setOpen(false)
    if (idField === 'property_id') {
      setRefresh(true)
    } else {
      setPropertyRefresh(true)
    }
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
