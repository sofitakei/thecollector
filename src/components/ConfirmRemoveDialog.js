import PropTypes from 'prop-types'

import { usePropertiesContext } from '../contexts/PropertiesContext'
import { usePropertyContext } from '../contexts/PropertyContext'
import { supabase } from '../supabaseClient'
import ConfirmActionDialog from './ConfirmActionDialog'

const ConfirmRemoveDialog = ({
  table = 'properties',
  idField = 'property_id',
  items,
  ...rest
}) => {
  const { setRefresh } = usePropertiesContext() || {}
  const { setRefresh: setPropertyRefresh } = usePropertyContext() || {}

  const handleDelete = async () =>
    await supabase
      .from(table)
      .update({ deleted: new Date().toISOString() })
      .in(
        'id',
        items.map(item => item[idField])
      )

  return (
    <ConfirmActionDialog
      onConfirmAction={handleDelete}
      setRefresh={idField === 'property_id' ? setRefresh : setPropertyRefresh}
      title='Confirm removal'
      dialogText=' Are you sure you want to remove the following?'
      items={items}
      {...rest}
    />
  )
}

ConfirmRemoveDialog.propTypes = {
  getter: PropTypes.func,
  idField: PropTypes.string,
  items: PropTypes.array.isRequired,
  setOpen: PropTypes.func.isRequired,
  table: PropTypes.string,
}

export default ConfirmRemoveDialog
