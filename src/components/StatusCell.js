import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import RunCircleIcon from '@mui/icons-material/RunCircle'
import { Stack, TableCell, Tooltip, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const StatusCell = ({ status = 'incomplete' }) => (
  <TableCell align='right'>
    <Stack direction='row' justifyContent='flex-end' spacing={2}>
      {status === 'complete' ? (
        <CheckCircleIcon fontSize='small' sx={{ color: 'green' }} />
      ) : status === 'incomplete' ? (
        <RunCircleIcon fontSize='small' sx={{ color: 'orange' }} />
      ) : null}
      <Typography>{status}</Typography>
      {status && status !== 'complete' && (
        <Tooltip title='Send Reminder'>
          <ForwardToInboxIcon />
        </Tooltip>
      )}
    </Stack>
  </TableCell>
)

StatusCell.propTypes = {
  status: PropTypes.string,
}
export default StatusCell
