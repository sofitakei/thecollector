import TaskAltIcon from '@mui/icons-material/TaskAlt'
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'

import { serviceTiers } from '../properties/payment/Payment'

const tierDescriptions = {
  [serviceTiers[0]]: {
    price: '$179 per Association',
    list: [
      'File BOI report with FinCEN',
      'Secured Beneficial Owner information collection',
      'Dashboard to manage Beneficial Owner information status',
      'Connect Beneficial Owners to multiple Associations',
      'Centralized management of multiple Associations',
      'Ongoing filing reminders',
      '$129 subsequent report filings within a 12 month period',
    ],
  },
  [serviceTiers[1]]: {
    price: '$299 per Association',
    subLabel: 'All Standard benefits',
    list: [
      'Personalized oversight on Beneficial Owner information collection',
      'Personalized oversight on filing deadlines with additional reminders to keep the Association on track',
      'Access to personalized guided filing assistance for each Beneficial Owner',
      '$129 subsequent report filings within a 12 month period',
    ],
  },
  [serviceTiers[2]]: {
    price: '$499 per Association',
    subLabel: 'All Facilitated benefits',
    list: [
      ' Access to specialized filing assistance and form completion for each Beneficial Owner',
      'Access to professional form review before filing',
      'Unlimited, free subsequent report filings within a 12 month period',
    ],
  },
}
const Pricing = () => (
  <>
    <Typography variant='h1' gutterBottom>
      Find the BOI Report Access that works for your Association
    </Typography>
    <Stack
      sx={{ flexWrap: 'wrap', rowGap: 2 }}
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}>
      {serviceTiers.map((tier, index) => {
        const { subLabel, price, list } = tierDescriptions[tier]
        return (
          <Box
            sx={{
              backgroundColor: `grey.${(index + 1) * 100}`,
              svg: { color: 'success.light' },
            }}
            my={2}
            p={2}
            borderRadius={3}
            flex={{ xs: '100%', sm: '100%', md: '30%' }}
            key={tier}>
            <Typography variant='h2'>{tier} Access</Typography>
            <Typography variant='price'>{price}</Typography>

            {subLabel && (
              <div>
                {subLabel} <strong>PLUS</strong>
              </div>
            )}
            <List>
              {list.map((text, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TaskAltIcon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Box>
        )
      })}
    </Stack>
  </>
)

export default Pricing
