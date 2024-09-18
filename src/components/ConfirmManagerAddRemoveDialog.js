import PropTypes from 'prop-types'
import { usePropertyContext } from '../contexts/PropertyContext'
import ConfirmActionDialog from './ConfirmActionDialog'
import { supabase } from '../supabaseClient'
import { useParams } from 'react-router-dom'

const ConfirmManagerAddRemoveDialog = ({
  addAsManager = false,
  items,
  ...rest
}) => {
  const { setRefresh } = usePropertyContext() || {}
  const { propertyId } = useParams()

  const handleManagerChange = async () => {
    return await supabase
      .from('userproperty')
      .update({ is_manager: addAsManager })
      .in(
        'user_id',
        items.map(({ user_id }) => user_id)
      )
      .eq('property_id', propertyId)
      .select()
  }

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
  getter: PropTypes.func,
  items: PropTypes.array.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default ConfirmManagerAddRemoveDialog
