import { Alert, List, ListItemText, Typography } from '@mui/material'
import { Link, useParams } from 'react-router-dom'

import { supabase } from '../supabaseClient'
import { useEffect, useState } from 'react'

const PreviouslyFilledForms = () => {
  const [forms, setForms] = useState([])
  const { propertyId } = useParams()

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase
        .from('property_filing')
        .select('*')
        .eq('property_id', propertyId)
      setForms(data)
    }

    getData()
  }, [])

  return forms?.length ? (
    <>
      <Typography variant='h4'>Form filed on:</Typography>
      <List>
        {forms.map(form => (
          <ListItemText key={form.id}>
            <Link to={`${form.id}`}>
              {new Date(form.created_at).toLocaleDateString('en-US')}
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
