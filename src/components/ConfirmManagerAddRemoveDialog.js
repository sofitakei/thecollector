import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import { usePropertyContext } from '../contexts/PropertyContext'
import { supabase } from '../supabaseClient'
import ConfirmActionDialog from './ConfirmActionDialog'

const ConfirmManagerAddRemoveDialog = ({
  addAsManager = false,
  items,
  ...rest
}) => {
  const { setRefresh } = usePropertyContext() || {}
  const { propertyId } = useParams()

  const handleManagerChange = async () =>
    await supabase
      .from('userproperty')
      .update({ is_manager: addAsManager })
      .in(
        'user_id',
        items.map(({ user_id }) => user_id)
      )
      .eq('property_id', propertyId)
      .select()

  const title = addAsManager
    ? 'Add the following as managers'
    : 'Remove the following as managers'

  return (
    <ConfirmActionDialog
      onConfirmAction={handleManagerChange}
      setRefresh={setRefresh}
      dialogTitle={title}
      dialogText=' Are you sure you want to change the role of these members?'
      items={items}
      {...rest}
    />
  )
}

ConfirmManagerAddRemoveDialog.propTypes = {
  addAsManager: PropTypes.bool,
  getter: PropTypes.func,
  items: PropTypes.array.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default ConfirmManagerAddRemoveDialog
