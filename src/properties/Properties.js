import { useParams } from 'react-router-dom'

import LinkedCell from '../components/LinkedCell'
import StatusCell from '../components/StatusCell'
import Table from '../components/Table'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import PropertyForm from './PropertyForm'
import PropertyHome from './PropertyHome'

const Properties = () => {
  const { properties, showRemovePropertyColumn } = usePropertiesContext()

  return properties ? (
    <Table
      checkboxAction='remove'
      columns={[
        {
          name: 'name',
          label: 'Name',
          Renderer: LinkedCell,
          RendererProps: {
            type: 'property',
            getter: ({ properties }) => properties.name,
            buildUrl: ({ property_id }) => `/properties/${property_id}`,
          },
        },
        { name: 'paid', label: '', defaultValue: 'unpaid' },
        {
          name: 'status',
          label: 'Status',
          Renderer: StatusCell,
          CellProps: { align: 'right' },
        },
      ]}
      data={properties}
      getter={({ name }) => name}
      showCheckbox={showRemovePropertyColumn}
    />
  ) : (
    <div>Loading...</div>
  )
}

export const Property = () => {
  let params = useParams()
  const { propertyId } = params

  return propertyId === 'new' ? <PropertyForm /> : <PropertyHome />
}

export default Properties
