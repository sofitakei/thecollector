import PaidIcon from '@mui/icons-material/Paid'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import { IconButton, TableCell, Tooltip } from '@mui/material'

const PaymentCell = ({ paid }) => {
  const Icon = paid ? PaidIcon : PriorityHighIcon
  return (
    <TableCell>
      <Tooltip enterTouchDelay={0} title={paid ? 'Paid' : 'Needs Payment'}>
        <IconButton>
          <Icon fontSize='12px' />
        </IconButton>
      </Tooltip>
    </TableCell>
  )
}

export default PaymentCell