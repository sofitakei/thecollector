import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'

import Navigation from './Navigation'
import { usePropertyContext } from '../contexts/PropertyContext'
import { Link } from 'react-router-dom'
import { AccountCircle } from '@mui/icons-material'

const drawerWidth = 240

const Copyright = props => (
  <Typography align='center' color='text.secondary' variant='body2' {...props}>
    {'Copyright © '}
    <Link color='inherit' href='https://mui.com/'>
      CondoBOI
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
)

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
    <>
      <Box sx={{ display: 'flex', a: { textDecoration: 'none' } }}>
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
              <Typography variant='h4' sx={{ color: '#fff' }}>
                {' '}
                {currentProperty?.name} Dashboard
              </Typography>
            </Link>
            <Link to='/profile'>
              <IconButton sx={{ color: '#fff' }}>
                <AccountCircle />
              </IconButton>
            </Link>
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
            p: 3,
            pt: 10,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}>
          {children}
        </Box>
      </Box>

      <Copyright sx={{ mt: 8, mb: 4 }} />
    </>
  )
}

NavShell.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NavShell
