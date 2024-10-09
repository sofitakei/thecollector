import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  FabButtonWithTooltip,
  IconButtonWithTooltip,
} from '../components/ButtonWithTooltip'
import ConfirmRemoveDialog from '../components/ConfirmRemoveDialog'
import LinkedCell from '../components/LinkedCell'
import PaymentCell from '../components/PaymentCell'
import StatusCell from '../components/StatusCell'
import Table from '../components/Table'
import { useAuth } from '../contexts/AuthContext'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import PropertyForm from './PropertyForm'
import PropertyHome from './PropertyHome'

const NoData = () => (
  <Box textAlign='left'>
    You current have no properties assigned.
    <br />
    <Link to='/properties/new'>Click here</Link> to get started
  </Box>
)

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
CheckboxActions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}
const getIsManager = ({ is_manager }) => is_manager

const Properties = () => {
  const {
    properties,
    propertiesStatus,
    loaded,
    selectedProperties,
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
              getter: ({ total_filers, verified_filers, status }) => {
                if (status === 'verified') {
                  return status
                } else if (
                  total_filers === verified_filers &&
                  status === null
                ) {
                  return 'ready'
                } else {
                  return 'incomplete'
                }
              },
            },
          },
        ]}
        idField='property_id'
        data={properties.map(property => {
          const merged = propertiesStatus?.find(
            ({ rproperty_id }) => rproperty_id === property.property_id
          )
          return { ...property, ...merged }
        })}
        NoDataMessage={<NoData />}
      />
      {showDialog && (
        <ConfirmRemoveDialog
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
