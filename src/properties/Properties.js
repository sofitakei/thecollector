import { Link, useParams } from 'react-router-dom'

import LinkedCell from '../components/LinkedCell'
import StatusCell from '../components/StatusCell'
import Table from '../components/Table'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import PropertyForm from './PropertyForm'
import PropertyHome from './PropertyHome'
import {
  Box,
  Fab,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import PaymentCell from '../components/PaymentCell'
import DeleteIcon from '@mui/icons-material/Delete'
import ConfirmRemoveDialog from '../components/ConfirmRemoveDialog'
import { useState } from 'react'
import {
  FabButtonWithTooltip,
  IconButtonWithTooltip,
} from '../components/ButtonWithTooltip'

const NoData = () => {
  return (
    <Box textAlign='left'>
      You current have no properties assigned.
      <br />
      <Link to='/properties/new'>Click here</Link> to get started
    </Box>
  )
}

const CheckboxActions = ({ disabled, onClick }) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))

  return matches ? (
    <FabButtonWithTooltip
      message='remove property'
      onClick={onClick}
      sxProps={{ position: 'absolute', bottom: 16, right: 16 }}
      color='primary'
      aria-label='remove property'
      disabled={disabled}>
      <DeleteIcon />
    </FabButtonWithTooltip>
  ) : (
    <Stack direction='row'>
      <IconButtonWithTooltip
        onClick={onClick}
        disabled={disabled}
        message='remove property'
        size='small'
        variant='outlined'>
        <DeleteIcon />
      </IconButtonWithTooltip>
    </Stack>
  )
}
const getIsManager = ({ is_manager }) => is_manager

const Properties = () => {
  const {
    properties,
    loaded,
    selectedProperties,
    setSelectedProperties,
    setRefresh,
  } = usePropertiesContext()
  const {
    userProfile: { first_name, email },
  } = useAuth()

  const showCheckbox = properties?.some(getIsManager)
  const [showDialog, setShowDialog] = useState()

  const handleShowDialog = () => {
    setShowDialog(true)
  }

  return properties ? (
    <>
      <Typography variant='h4'>Welcome, {first_name || email}</Typography>
      {/* TODO: use DataGrid? */}
      <CheckboxActions
        disabled={selectedProperties?.length === 0}
        onClick={handleShowDialog}
      />
      <Table
        getCheckboxEnabled={getIsManager}
        showCheckbox={showCheckbox}
        checkboxAction='remove'
        columns={[
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
            name: 'paid',
            RendererProps: { paid: false },

            defaultValue: false,
            Renderer: PaymentCell,
          },
          {
            name: 'status',
            label: 'Status',
            Renderer: StatusCell,
            CellProps: { align: 'right' },
            RendererProps: {
              getter: ({ status }) => status,
            },
          },
        ]}
        idField='property_id'
        data={properties}
        NoDataMessage={<NoData />}
      />
      {showDialog && (
        <ConfirmRemoveDialog
          setSelectedData={setSelectedProperties}
          items={selectedProperties}
          idField='property_id'
          setOpen={setShowDialog}
          table='properties'
          setRefresh={setRefresh}
        />
      )}
    </>
  ) : (
    <div>{loaded ? 'no data' : 'Loading...'}</div>
  )
}

export const Property = () => {
  let params = useParams()
  const { propertyId } = params

  return propertyId === 'new' ? <PropertyForm /> : <PropertyHome />
}

export default Properties
