import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckIcon from '@mui/icons-material/Check'
import FileOpenIcon from '@mui/icons-material/FileOpen'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { forwardRef } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { useAuth } from './contexts/AuthContext'

const MotionBox = motion(Box)
// eslint-disable-next-line react/display-name
const StepBox = forwardRef((props, ref) => (
  <AnimatePresence>
    <MotionBox
      ref={ref}
      borderRadius={3}
      p={3}
      m={3}
      flex={{ xs: '100%', sm: '30%' }}
      {...props}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.51, ease: 'easeOut' }}
    />
  </AnimatePresence>
))

const steps = [
  {
    Icon: PersonAddAltIcon,
    text: 'Create an account and add your Association',
    sx: {
      backgroundColor: 'primary.dark',
      color: 'primary.contrastText',
    },
  },
  {
    sx: {
      border: '1px solid',
      borderColor: 'primary.light',
      color: 'text.primary',
    },
    Icon: ForwardToInboxIcon,
    text: 'Invite Beneficial Owners to your Association',
  },
  {
    sx: {
      backgroundColor: 'primary.light',
      color: 'primary.contrastText',
    },
    Icon: AssignmentIcon,
    text: 'Collect secured Beneficial Owner information in minutes',
  },
  {
    sx: {
      backgroundColor: 'primary.dark',
      color: 'primary.contrastText',
    },
    Icon: FileOpenIcon,
    text: "File your Association's report containing automatically consolidated Beneficial Owner information with a click of a button",
  },
  {
    sx: {
      border: '1px solid',
      borderColor: 'primary.light',
      color: 'text.primary',
    },
    Icon: SupportAgentIcon,
    text: 'Keep Associations compliant with filing requirements with ongoing support with reminders',
  },
]

const Home = () => {
  const { session } = useAuth()
  if (session?.user?.id) return <Navigate to='/properties' />

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}>
      <Typography variant='h1'>
        File your Association's Beneficial Ownership Information report with
        confidence.
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
          <ListItemText primary='Secure and intuitive step-by-step solution for your Association to file its Beneficial Ownership Information report with FinCEN under the Corporate Transparency Act.' />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
          <ListItemText
            primary='No payment required until your Association is ready to submit a report for
      filing.'
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckIcon />
          </ListItemIcon>
          <ListItemText
            primary='Created specifically for Associations by attorney CPA auditors that have
      over 15 years of working directly and exclusively with Associations.'
          />
        </ListItem>
      </List>
      <Typography gutterBottom variant='h2'>
        Steps to file
      </Typography>
      <Stack sx={{ flexWrap: 'wrap' }} direction={{ xs: 'column', sm: 'row' }}>
        {steps.map(({ Icon, text, sx }, idx) => (
          <StepBox key={idx} sx={sx}>
            <Icon style={{ fontSize: 40 }} />
            <Typography variant='step'>Step {idx + 1}</Typography>
            <div>{text}</div>
          </StepBox>
        ))}
      </Stack>
      <Box sx={{ a: { color: 'text.primary', textDecoration: 'underline' } }}>
        Looking for a solution for your Management Company?{' '}
        <Link to='/contact-us'>Contact us</Link> for enterprise solutions.
      </Box>
    </MotionBox>
  )
}

export default Home
