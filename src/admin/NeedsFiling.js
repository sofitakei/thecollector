import { Download } from '@mui/icons-material'
import { Button, IconButton, TableCell } from '@mui/material'
import { json2csv } from 'json-2-csv'
import { useState } from 'react'

import LinkedCell from '../components/LinkedCell'
import PaginatedData from '../components/PaginatedData'
import { taxIdTypes } from '../properties/config'
import { supabase } from '../supabaseClient'
import { downloadFile } from '../utils'
import ConfirmMarkCompleteDialog from './ConfirmMarkCompleteDialog'
//TODO: have to check for payment status
const fieldsToExport = [
  'email',
  'fincen_id',
  'first_name',
  'middle_name',
  'last_name',
  'suffix',
  'birth_date',
  'state',
  'address',
  'postal_code',
  'country_jurisdiction',
  'document_type',
  'effective_date',
  'document_number',
  'document_country_jurisdiction',
  'document_jurisdiction_local_tribal_id',
  'document_jurisdiction_other_description',
  'document_expiration',
  'identification_url',
]

const propertyFieldsToExport = [
  'name',
  'tax_id_type',
  'tax_id_number',
  'address',
  'city',
  'state',
  'country_jurisdiction',
  'zipcode', //add jurisdiction of formation
]
const FiledButton = ({ item, handleClick }) => {
  const onClick = e => {
    e.preventDefault()
    handleClick(item)
  }
  return (
    <TableCell>
      <Button onClick={onClick} variant='outlined'>
        Mark as filed
      </Button>
    </TableCell>
  )
}

const exportToCsv = data => {
  const filing = data

  const users = data.filing
    .filter(user => user !== null)
    .map(user =>
      fieldsToExport.reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: user[curr],
        }),
        {}
      )
    )
  const reportingCompany = propertyFieldsToExport.reduce(
    (acc, curr) => ({
      ...acc,

      [curr]:
        curr === 'tax_id_type'
          ? taxIdTypes.find(({ value }) => `${value}` === filing[curr])?.name
          : filing[curr],
    }),
    { email: 'N/A - Reporting Company Info' }
  )

  const csv = json2csv([reportingCompany, ...users])
  downloadFile({
    data: csv,
    fileName: `${filing.name}_${new Date().toLocaleDateString('en-US')}.csv`,
    fileType: 'text/csv',
  })
}

const DownloadToCSV = props => {
  const handleClick = () => {
    exportToCsv(props.item)
  }
  return (
    <TableCell>
      <IconButton onClick={handleClick}>
        <Download />
      </IconButton>
    </TableCell>
  )
}

const NeedsFiling = () => {
  const [selectedProperty, setSelectedProperty] = useState(null)

  const handleMarkCompleteClick = property => {
    setSelectedProperty(property)
  }

  const handleConfirmMarkComplete = async () => {
    const submittedDate = new Date().toISOString()
    const { data, error } = await supabase
      .from('property_filing')
      .update({ submitted: submittedDate })
      .eq('id', selectedProperty.id)
      .select()
    console.log({ data, error }, 'updated')
  }

  return (
    <>
      <h4>Needs Filing</h4>
      <PaginatedData
        supabaseFn={supabase.from('v_property_filings').select('*')}
        countSupabaseFn={supabase
          .from('v_property_filings')
          .select('*', { count: 'exact', head: true })}
        TableProps={{
          columns: [
            {
              name: 'name',
              label: 'Name',
              Renderer: LinkedCell,
              RendererProps: {
                type: 'property',
                getter: ({ name }) => name,
                buildUrl: ({ property_id }) => `/properties/${property_id}`,
              },
            },

            {
              name: 'csv',
              Renderer: DownloadToCSV,
            },
            {
              name: 'filed',
              Renderer: FiledButton,
              RendererProps: { handleClick: handleMarkCompleteClick },
            },
          ],
          idField: 'property_id',
        }}
      />
      {selectedProperty !== null && (
        <ConfirmMarkCompleteDialog
          onConfirmAction={handleConfirmMarkComplete}
          open
          setProperty={setSelectedProperty}
          propertyName={selectedProperty?.name}
        />
      )}
    </>
  )
}

export default NeedsFiling
