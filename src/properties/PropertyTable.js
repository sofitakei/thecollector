import PropTypes from 'prop-types'

import LinkedCell from '../components/LinkedCell'
import StatusCell from '../components/StatusCell'
import Table from '../components/Table'
import { usePropertiesContext } from '../contexts/PropertiesContext'

const emptyIfNull = str => (!str || str === null ? '' : str)
const PropertyTable = ({ users }) => {
  const { showMemberCheckboxColumn } = usePropertiesContext()
  const showCheckbox = Boolean(showMemberCheckboxColumn)

  return (
    <Table
      checkboxAction={showMemberCheckboxColumn}
      columns={[
        {
          name: 'name',
          label: 'Name',
          Renderer: LinkedCell,
          RendererProps: {
            getter: ({ first_name, last_name, email }) =>
              first_name || last_name
                ? `${emptyIfNull(first_name)} ${emptyIfNull(last_name)}`
                : `(${email})`,
            buildUrl: ({ user_id }) => `users/${user_id}/edit`,
          },
        },

        {
          name: 'status',
          label: 'Status',
          Renderer: StatusCell,
          RendererProps: {
            getter: ({ first_name, last_name, email }) =>
              first_name || last_name
                ? `${emptyIfNull(first_name)} ${emptyIfNull(last_name)}`
                : `(${email})`,
          },
        },
      ]}
      data={users}
      getter={({ firstName, lastName }) => `${firstName} ${lastName}`}
      showCheckbox={showCheckbox}
    />
  )
}

PropertyTable.propTypes = {
  users: PropTypes.array.isRequired,
}
export default PropertyTable
