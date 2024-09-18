import { Alert, Box, Button, Stack, Typography } from '@mui/material'

import { useAuth } from '../contexts/AuthContext'
import PropertyTable from './PropertyTable'
import { supabase } from '../supabaseClient'
import { useNavigate, useParams } from 'react-router-dom'
import { usePropertyContext } from '../contexts/PropertyContext'
import { useState } from 'react'
import CheckboxActions from './CheckboxActions'

import ConfirmRemoveDialog from '../components/ConfirmRemoveDialog'
import ConfirmManagerAddRemoveDialog from '../components/ConfirmManagerAddRemoveDialog'
import ConfirmSendNotificationsDialog from '../components/ConfirmSendNotificationsDialog'
import { emptyIfNull } from '../utils'

const actionDialog = {
  send: ConfirmSendNotificationsDialog,
  remove: ConfirmRemoveDialog,
  managerAdd: props => (
    <ConfirmManagerAddRemoveDialog addAsManager {...props} />
  ),
  managerRemove: ConfirmManagerAddRemoveDialog,
}

const initialState = {
  owner: [],
  board: [],
  nonreporting: [],
}
const PropertyHome = () => {
  const {
    propertyUsers,
    sessionPropertyUser,
    setRefresh,
    selectedMembers: selectedItems,
  } = usePropertyContext() || {}
  const { userProfile } = useAuth()
  const { propertyId } = useParams()
  const { board_member, owner, unassigned } = propertyUsers
  const isManager = sessionPropertyUser?.is_manager
  const navigate = useNavigate()
  const [allSelected, setAllSelected] = useState(initialState)
  const [action, setAction] = useState()

  const handleDelete = () => {
    setAction('remove')
  }

  const handleSend = () => {
    setAction('send')
  }

  const handleManager = add => () => {
    setAction(add ? 'managerAdd' : 'managerRemove')
  }
  const handleClick = () => {
    if (!isManager) {
      console.log('TODO: send request access')
    } else {
      navigate(`/properties/${propertyId}/submit`)
    }
  }

  const handleSelected = role => selected => {
    setAllSelected(old => ({ ...old, [role]: selected }))
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
        {isManager ? 'SUBMIT FORM' : 'Request manager access'}
      </Button>
      <Box mb={5} mt={2}>
        <Typography component='h2' gutterBottom variant='h6'>
          Board Members
        </Typography>
        <PropertyTable
          onSelected={handleSelected('board')}
          users={board_member}
          showCheckbox={isManager}
        />
        <br />
        <Typography component='h2' gutterBottom variant='h6'>
          Owners of 25% or More
        </Typography>
        <PropertyTable
          onSelected={handleSelected('owner')}
          users={owner}
          showCheckbox={isManager}
        />
        <br />
        <Typography component='h2' gutterBottom variant='h6'>
          Non Reporting
        </Typography>
        <PropertyTable
          onSelected={handleSelected('nonreporting')}
          users={unassigned}
          nonReporting
          showCheckbox={isManager}
        />
      </Box>
      {action && (
        <ConfirmRenderer
          getter={({ first_name, last_name, email }) =>
            `${emptyIfNull(first_name)} ${emptyIfNull(
              last_name
            )} (${emptyIfNull(email)})`
          }
          items={selectedItems}
          setSelectedData={() => {
            setAllSelected(initialState)
          }}
          setOpen={setAction}
          setRefresh={setRefresh}
        />
      )}
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
    </Stack>
  )
}

export default PropertyHome
