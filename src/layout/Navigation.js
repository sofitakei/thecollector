import { Drawer, List, ListItemButton, Typography } from '@mui/material'
import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { usePropertiesContext } from '../contexts/PropertiesContext'

const drawerWidth = 240
const Navigation = props => {
  const {
    setSelectedMembers,
    setShowRemovePropertyColumn,
    setShowMemberCheckboxColumn,
    sessionPropertyUser,
  } = usePropertiesContext()
  const { propertyId } = useParams()
  const location = useLocation()
  const { userProfile, logout } = useAuth()
  const isManager = sessionPropertyUser?.is_manager
  const handleLogout = async () => {
    try {
      const { error } = await logout()
      console.log(error)
    } catch (error) {
      console.log(error)
    }
  }

  const isPropertyHome =
    matchPath('/properties/:propertyId', location.pathname) &&
    propertyId !== 'new'

  const items = [
    { label: 'Home', path: '/properties', include: true },
    {
      label: 'Edit Property',
      path: `/properties/${propertyId}/edit`,
      include: isPropertyHome && isManager,
    },
    {
      label: 'Invite Members',
      path: `/properties/${propertyId}/invite`,
      include: isPropertyHome && isManager,
    },
    {
      label: 'Add Members Manually',
      path: `/properties/${propertyId}/addMembers`,
      include: isPropertyHome && isManager,
    },
    {
      label: 'Remove Members',
      showForProperty: true,
      onClick: () => {
        setShowMemberCheckboxColumn('remove')
      },
      include: isPropertyHome && isManager,
    },
    {
      label: 'Add/Remove Managers',
      showForProperty: true,
      onClick: () => {
        setShowMemberCheckboxColumn('manager')
      },
      include: isPropertyHome && isManager,
    },
    {
      label: 'Make Payment',
      path: `/properties/${propertyId}/payment`,
      include: isPropertyHome && isManager,
    },
    {
      label: 'Previously Filled Forms',
      path: `/properties/${propertyId}/history`,
      include: isPropertyHome,
    },
    {
      label: 'Send Reminder',
      showForProperty: true,
      onClick: () => {
        setSelectedMembers([])
        setShowMemberCheckboxColumn('notify')
      },
      include: isPropertyHome && isManager,
    },
    {
      label: 'SUBMIT FORM',
      path: `/properties/${propertyId}/submit`,
      include: isPropertyHome && isManager,
    },

    { label: 'Add Property', path: '/properties/new', include: !propertyId },
    {
      label: 'Remove Property',
      onClick: () => {
        setShowRemovePropertyColumn(true)
      },
      include: !propertyId,
    },
  ]
  const navItems = items.filter(item => item.include)

  const navigate = useNavigate()

  return (
    <>
      <Drawer {...props}>
        <List component='nav'>
          {navItems.map(({ path, label, onClick }) => (
            <ListItemButton
              key={label}
              onClick={() => {
                if (onClick) {
                  onClick()
                  return
                } else if (path) {
                  navigate(path)
                }
              }}>
              {label}
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Drawer
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        variant='permanent'>
        <Typography variant='body2'>
          Hello, {`${userProfile?.first_name || ''} (${userProfile?.email})`}
        </Typography>
        <List>
          {navItems.map(({ path, label, onClick }) => (
            <ListItemButton
              key={label}
              onClick={() => {
                if (onClick) {
                  onClick()
                  return
                } else if (path) {
                  navigate(path)
                }
              }}>
              {label}
            </ListItemButton>
          ))}
          <ListItemButton onClick={handleLogout}>Logout</ListItemButton>
        </List>
      </Drawer>
    </>
  )
}
export default Navigation
