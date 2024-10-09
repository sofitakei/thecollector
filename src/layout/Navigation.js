import { Drawer, List, ListItemButton, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { usePropertyContext } from '../contexts/PropertyContext'

const drawerWidth = 240
const Navigation = props => {
  const { currentProperty, sessionPropertyUser } = usePropertyContext() || {}
  const { propertyId } = useParams()
  const location = useLocation()
  const { userProfile } = useAuth()
  const isManager = sessionPropertyUser?.is_manager
  const navigate = useNavigate()

  const isPropertyHome =
    matchPath('/properties/:propertyId', location.pathname) &&
    propertyId !== 'new'

  const items = [
    { label: 'Home', path: '/properties', include: true },
    {
      label: `${currentProperty?.name} Dashboard`,
      path: `/properties/${propertyId}`,
      include:
        propertyId !== 'new' && propertyId !== undefined && propertyId !== '',
    },
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
      label: 'SUBMIT FORM',
      path: `/properties/${propertyId}/submit`,
      include: isPropertyHome && isManager,
    },

    { label: 'Add Property', path: '/properties/new', include: !propertyId },
  ]
  const navItems = items.filter(item => item.include)
  const { onClose } = props
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
                  onClose()
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
          Logged in as {`${userProfile?.email}`}
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
                  onClose()
                  navigate(path)
                }
              }}>
              {label}
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  )
}

Navigation.propTypes = {
  onClose: PropTypes.func.isRequired,
}
export default Navigation
