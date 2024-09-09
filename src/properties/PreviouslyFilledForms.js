import { Alert, List, ListItemText, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { usePropertiesContext } from '../contexts/PropertiesContext'

const PreviouslyFilledForms = () => {
  const { currentProperty } = usePropertiesContext()
  const { forms = [] } = currentProperty

  return forms.length ? (
    <>
      <Typography variant='h4'>Form filed on:</Typography>
      <List>
        {forms.map(form => (
          <ListItemText key={form.id}>
            <Link to={`${form.id}`}>
              {new Date(form.filedDate).toLocaleDateString('en-US')}
            </Link>
          </ListItemText>
        ))}
      </List>
    </>
  ) : (
    <Alert severity='info'>No forms previously filed</Alert>
  )
}

export default PreviouslyFilledForms
