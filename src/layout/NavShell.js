import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { usePropertyContext } from '../contexts/PropertyContext'
import AccountMenu from './AccountMenu'
import Footer from './Footer'
import Navigation from './Navigation'

const drawerWidth = 240

const NavShell = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const { currentProperty } = usePropertyContext() || {}
  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  return (
    <Stack
      my={3}
      direction={{ sm: 'row', xs: 'column' }}
      alignItems='center'
      sx={{ a: { textDecoration: 'none' } }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            aria-label='open drawer'
            color='inherit'
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Link to={`/properties/${currentProperty?.id}`}>
            <Typography
              sx={{
                color: '#fff',
                typography: { sm: 'h4', xs: 'h5' },
              }}>
              {currentProperty?.name}
            </Typography>
          </Link>
          <AccountMenu />
        </Toolbar>
      </AppBar>
      <Box
        aria-label='mailbox folders'
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Navigation
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          onClose={handleDrawerClose}
          onTransitionEnd={handleDrawerTransitionEnd}
          open={mobileOpen}
        />
      </Box>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          pt: { xs: 12, sm: 10 },
          px: 2,

          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}>
        {children}

        <Footer />
      </Box>
    </Stack>
  )
}

NavShell.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NavShell
