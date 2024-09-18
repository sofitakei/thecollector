import {
  Avatar,
  Badge,
  Chip,
  IconButton,
  TableCell,
  Tooltip,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import { useAuth } from '../contexts/AuthContext'
import { usePropertyContext } from '../contexts/PropertyContext'

const LinkedCell = ({ getter, buildUrl, item, type }) => {
  const { userProfile } = useAuth()
  const { sessionPropertyUser } = usePropertyContext() || {}
  const isManager = sessionPropertyUser?.is_manager

  const text = getter(item)
  return (
    <TableCell>
      {type === 'property' || isManager || userProfile?.id === item.user_id ? (
        <Link item={item} to={buildUrl(item)} type={type}>
          {text}
        </Link>
      ) : (
        text
      )}
      {item.is_manager && (
        <Tooltip enterTouchDelay={0} title='Manager'>
          <IconButton>
            <SupervisorAccountIcon fontSize='12' />
          </IconButton>
        </Tooltip>
      )}
    </TableCell>
  )
}
LinkedCell.propTypes = {
  getter: PropTypes.func,
  buildUrl: PropTypes.func,
  item: PropTypes.object.isRequired,
}
export default LinkedCell
