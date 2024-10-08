import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import PropTypes from 'prop-types'

import { usePropertiesContext } from '../contexts/PropertiesContext'
import { usePropertyContext } from '../contexts/PropertyContext'

const ConfirmActionDialog = ({
  getter = ({ name }) => name,
  items,
  setOpen,
  dialogTitle,
  dialogText,
  onConfirmAction,
  setRefresh,
}) => {
  const { setSelectedMembers } = usePropertyContext() || {}
  const { setSelectedProperties } = usePropertiesContext() || {}
  const handleClose = () => {
    setOpen(false)
  }
  const handleConfirmAction = async () => {
    const { error } = await onConfirmAction()
    if (error === null) {
      setOpen(false)
      setSelectedMembers?.([])
      setSelectedProperties?.([])
      setRefresh(true)
    }
  }

  return (
    <Dialog open>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        {dialogText}
        <ul>
          {items.map(item => (
            <li key={item.userproperty_id || item.property_id}>
              {getter(item)}
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirmAction}>Yes</Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmActionDialog.propTypes = {
  dialogText: PropTypes.string,
  dialogTitle: PropTypes.string,
  getter: PropTypes.func,
  items: PropTypes.array.isRequired,
  onConfirmAction: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
  setRefresh: PropTypes.func,
}

export default ConfirmActionDialog
