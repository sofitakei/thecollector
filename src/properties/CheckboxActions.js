import {
  Fab,
  IconButton,
  Stack,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import GroupRemoveIcon from '@mui/icons-material/GroupRemove'
import ButtonWithTooltip, {
  FabButtonWithTooltip,
  IconButtonWithTooltip,
} from '../components/ButtonWithTooltip'

const start = 16
const spacing = 80

const CheckboxActions = ({
  deleteDisabled,
  managerAddDisabled,
  managerRemoveDisabled,
  onDelete,
  onNotify,
  onRemoveManager,
  onAddManager,
}) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))

  return matches ? (
    <>
      <FabButtonWithTooltip
        disabled={deleteDisabled}
        aria-label='remove-member'
        color='primary'
        message='Remove Member'
        sxProps={{ right: start }}>
        <DeleteIcon />
      </FabButtonWithTooltip>

      <FabButtonWithTooltip
        message='Send notification'
        onClick={onNotify}
        sxProps={{
          right: start + spacing,
        }}
        color='secondary'
        aria-label='send notification'
        disabled={deleteDisabled}>
        <SendIcon />
      </FabButtonWithTooltip>
      <FabButtonWithTooltip
        message='Add Managers'
        onClick={onAddManager}
        sxProps={{
          right: start + spacing * 2,
        }}
        color='success'
        aria-label='add managers'
        disabled={managerAddDisabled}>
        <GroupAddIcon />
      </FabButtonWithTooltip>

      <FabButtonWithTooltip
        message='Remove managers'
        onClick={onRemoveManager}
        sxProps={{
          right: start + spacing * 3,
        }}
        color='tertiary'
        aria-label='remove managers'
        disabled={managerRemoveDisabled}>
        <GroupRemoveIcon />
      </FabButtonWithTooltip>
    </>
  ) : (
    <Stack direction='row' mt={2}>
      <IconButtonWithTooltip
        message='Remove member'
        onClick={onDelete}
        disabled={deleteDisabled}
        size='small'
        color='primary'>
        <DeleteIcon />
      </IconButtonWithTooltip>
      <IconButtonWithTooltip
        message='Send reminder'
        onClick={onNotify}
        disabled={deleteDisabled}
        size='small'
        color='secondary'>
        <SendIcon />
      </IconButtonWithTooltip>
      <IconButtonWithTooltip
        message='Add as manager'
        onClick={onAddManager}
        disabled={managerAddDisabled}
        size='small'
        color='tertiary'
        variant='outlined'>
        <GroupAddIcon />
      </IconButtonWithTooltip>
      <IconButtonWithTooltip
        message='Remove as manager'
        onClick={onRemoveManager}
        disabled={managerRemoveDisabled}
        size='small'
        color='tertiary'
        variant='outlined'>
        <GroupRemoveIcon />
      </IconButtonWithTooltip>
    </Stack>
  )
}

export default CheckboxActions
