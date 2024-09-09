import { useParams } from 'react-router-dom'

import LinkedCell from '../components/LinkedCell'
import StatusCell from '../components/StatusCell'
import Table from '../components/Table'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import PropertyForm from './PropertyForm'
import PropertyHome from './PropertyHome'
import { Typography } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

const Properties = () => {
  const { properties, showRemovePropertyColumn } = usePropertiesContext()
  const {
    userProfile: { first_name, email },
  } = useAuth()
  return properties ? (
    <>
      <Typography variant='h4'>Welcome, {first_name || email}</Typography>
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
          { name: 'paid', label: '', defaultValue: 'Not Paid' },
          {
            name: 'status',
            label: 'Status',
            Renderer: StatusCell,
            RendererProps: {
              getter: ({ properties }) =>
                properties.filing_current ? 'complete' : 'incomplete',
            },
          },
        ]}
        data={properties}
        getter={({ name }) => name}
        showCheckbox={showRemovePropertyColumn}
      />
    </>
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
