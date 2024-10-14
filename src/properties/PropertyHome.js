import { Box, Button, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import ConfirmManagerAddRemoveDialog from '../components/ConfirmManagerAddRemoveDialog'
import ConfirmRemoveDialog from '../components/ConfirmRemoveDialog'
import ConfirmSendNotificationsDialog from '../components/ConfirmSendNotificationsDialog'
import { useAuth } from '../contexts/AuthContext'
import { usePropertyContext } from '../contexts/PropertyContext'
import { emptyIfNull } from '../utils'
import CheckboxActions from './CheckboxActions'
import PropertyTable from './PropertyTable'

const actionDialog = {
  send: ConfirmSendNotificationsDialog,
  remove: ConfirmRemoveDialog,
  managerAdd: props => (
    <ConfirmManagerAddRemoveDialog addAsManager {...props} />
  ),
  managerRemove: ConfirmManagerAddRemoveDialog,
}

const PropertyHome = () => {
  const {
    propertyUsers,
    sessionPropertyUser,
    setRefresh,
    selectedMembers: selectedItems,
  } = usePropertyContext() || {}
  const { userRole } = useAuth()
  const { propertyId } = useParams()
  const { board_member, owner, unassigned } = propertyUsers
  const isManager = sessionPropertyUser?.is_manager
  const navigate = useNavigate()

  const [action, setAction] = useState()

  const handleDelete = () => {
    if (selectedItems?.length === 0) return
    setAction('remove')
  }

  const handleSend = () => {
    setAction('send')
  }

  const handleManager = add => () => {
    setAction(add ? 'managerAdd' : 'managerRemove')
  }
  const handleClick = () => {
    if (!isManager && userRole !== 'admin') {
      console.log('TODO: send request access')
    } else {
      navigate(`/properties/${propertyId}/submit`)
    }
  }

  const ConfirmRenderer = actionDialog[action]
  const submittable = [
    ...propertyUsers.owner,
    ...propertyUsers.board_member,
  ].every(({ status }) => status === 'verified')

  return (
    <Stack>
      <Button
        variant='outlined'
        disabled={isManager ? !submittable : false}
        onClick={handleClick}>
        {isManager || userRole === 'admin'
          ? 'SUBMIT FORM'
          : 'Request manager access'}
      </Button>
      {isManager && (
        <CheckboxActions
          onNotify={handleSend}
          onAddManager={handleManager(true)}
          onRemoveManager={handleManager()}
          onDelete={handleDelete}
          deleteDisabled={selectedItems?.length === 0}
          managerRemoveDisabled={
            selectedItems?.length === 0 ||
            !selectedItems?.every(({ is_manager }) => is_manager)
          }
          managerAddDisabled={
            selectedItems?.length === 0 ||
            selectedItems?.some(({ is_manager }) => is_manager)
          }
        />
      )}
      <Box mb={5} mt={2}>
        <Typography component='h2' gutterBottom variant='h6'>
          Board Members
        </Typography>
        <PropertyTable users={board_member} showCheckbox={isManager} />
        <br />
        <Typography component='h2' gutterBottom variant='h6'>
          Owners of 25% or More
        </Typography>
        <PropertyTable users={owner} showCheckbox={isManager} />
        <br />
        <Typography component='h2' gutterBottom variant='h6'>
          Non Reporting
        </Typography>
        <PropertyTable
          users={unassigned}
          nonReporting
          showCheckbox={isManager}
        />
      </Box>
      {action && (
        <ConfirmRenderer
          table='userproperty'
          idField='userproperty_id'
          getter={({ first_name, last_name, email }) =>
            `${emptyIfNull(first_name)} ${emptyIfNull(
              last_name
            )} (${emptyIfNull(email)})`
          }
          items={selectedItems}
          setOpen={setAction}
          setRefresh={setRefresh}
        />
      )}
    </Stack>
  )
}

export default PropertyHome
