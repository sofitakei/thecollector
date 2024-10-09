import PropTypes from 'prop-types'

import { usePropertyContext } from '../contexts/PropertyContext'
import ConfirmActionDialog from './ConfirmActionDialog'

const ConfirmSendNotificationsDialog = props => {
  const { setRefresh } = usePropertyContext() || {}

  const handleSend = async () => {
    console.log('send notifications')
  }

  return (
    <ConfirmActionDialog
      onConfirmAction={handleSend}
      setRefresh={setRefresh}
      dialogTitle='Send notifications'
      dialogText=' Are you sure you want to email the following members?'
      {...props}
    />
  )
}

ConfirmSendNotificationsDialog.propTypes = {
  getter: PropTypes.func,
  items: PropTypes.array.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default ConfirmSendNotificationsDialog
