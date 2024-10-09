import { TableCell, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const statusColor = {
  complete: 'green',
  incomplete: 'red',
  ready: 'green',
  filed: 'green',
}
const StatusCell = ({ getter, item }) => {
  const cellStatus = getter(item)
  const status =
    cellStatus === 'verified'
      ? 'complete'
      : cellStatus === 'ready'
      ? 'ready to file'
      : cellStatus === 'filed'
      ? 'filed'
      : 'incomplete'
  return (
    <TableCell align='right'>
      <Typography
        sx={{ color: statusColor[status] || statusColor[cellStatus] }}>
        {status}
      </Typography>
    </TableCell>
  )
}

StatusCell.propTypes = {
  status: PropTypes.string,
  getter: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired, //TODO actual item shape
}
export default StatusCell
