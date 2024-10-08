import PropTypes from 'prop-types'

import LinkedCell from '../components/LinkedCell'
import StatusCell from '../components/StatusCell'
import Table from '../components/Table'

const emptyIfNull = str => (!str || str === null ? '' : str)

const getCheckboxEnabled = () => true

const PropertyTable = ({ nonReporting = false, users, showCheckbox }) => (
  <Table
    getCheckboxEnabled={getCheckboxEnabled}
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

      nonReporting
        ? null
        : {
            name: 'status',
            label: 'Status',
            Renderer: StatusCell,
            CellProps: { align: 'right' },
            RendererProps: {
              getter: ({ status }) => status,
            },
          },
    ].filter(col => col !== null)}
    data={users}
    getter={({ first_name, last_name }) => `${first_name} ${last_name}`}
    showCheckbox={showCheckbox}
    table='userproperty'
    idField='userproperty_id'
  />
)

PropertyTable.propTypes = {
  nonReporting: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  users: PropTypes.array.isRequired,
}
export default PropertyTable
