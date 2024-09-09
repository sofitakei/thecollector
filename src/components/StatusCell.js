import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox'
import RunCircleIcon from '@mui/icons-material/RunCircle'
import { Stack, TableCell, Tooltip, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const statusColor = {
  complete: 'green',
  incomplete: 'red',
}
const StatusCell = ({ getter, item }) => {
  const status = getter(item)
  return (
    <TableCell>
      <Typography sx={{ color: statusColor[status] }}>{status}</Typography>
    </TableCell>
  )
}

StatusCell.propTypes = {
  status: PropTypes.string,
}
export default StatusCell
