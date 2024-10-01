import { Fab, IconButton, Stack, useMediaQuery, useTheme } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import GroupRemoveIcon from '@mui/icons-material/GroupRemove'

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
      <Fab
        onClick={onDelete}
        sx={{ position: 'absolute', bottom: 16, right: start }}
        color='primary'
        aria-label='remove member'
        disabled={deleteDisabled}>
        <DeleteIcon />
      </Fab>
      <Fab
        onClick={onNotify}
        sx={{ position: 'absolute', bottom: 16, right: start + spacing }}
        color='secondary'
        aria-label='send notification'
        disabled={deleteDisabled}>
        <SendIcon />
      </Fab>
      <Fab
        onClick={onAddManager}
        sx={{ position: 'absolute', bottom: 16, right: start + spacing * 2 }}
        color='success'
        aria-label='add managers'
        disabled={managerAddDisabled}>
        <GroupAddIcon />
      </Fab>

      <Fab
        onClick={onRemoveManager}
        sx={{ position: 'absolute', bottom: 16, right: start + spacing * 3 }}
        color='tertiary'
        aria-label='remove managers'
        disabled={managerRemoveDisabled}>
        <GroupRemoveIcon />
      </Fab>
    </>
  ) : (
    <Stack direction='row' mt={2}>
      <IconButton
        onClick={onDelete}
        disabled={deleteDisabled}
        size='small'
        color='primary'>
        <DeleteIcon />
      </IconButton>
      <IconButton
        onClick={onNotify}
        disabled={deleteDisabled}
        size='small'
        color='secondary'
        variant='outlined'>
        <SendIcon />
      </IconButton>
      <IconButton
        onClick={onAddManager}
        disabled={managerAddDisabled}
        size='small'
        color='tertiary'
        variant='outlined'>
        <GroupAddIcon />
      </IconButton>
      <IconButton
        onClick={onRemoveManager}
        disabled={managerRemoveDisabled}
        size='small'
        color='tertiary'
        variant='outlined'>
        <GroupRemoveIcon />
      </IconButton>
    </Stack>
  )
}

export default CheckboxActions
