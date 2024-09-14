import { TableCell, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const statusColor = {
  complete: 'green',
  incomplete: 'red',
}
const StatusCell = ({ getter, item }) => {
  const cellStatus = getter(item)
  const status = cellStatus === 'verified' ? 'complete' : 'incomplete'
  return (
    <TableCell align='right'>
      <Typography sx={{ color: statusColor[status] }}>{status}</Typography>
    </TableCell>
  )
}

StatusCell.propTypes = {
  status: PropTypes.string,
}
export default StatusCell
