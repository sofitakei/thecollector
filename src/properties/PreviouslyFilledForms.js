import { Alert, List, ListItemText, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { supabase } from '../supabaseClient'

const PreviouslyFilledForms = () => {
  const [forms, setForms] = useState([])
  const { propertyId } = useParams()

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase
        .from('property_filing')
        .select('*')
        .eq('property_id', propertyId)
      setForms(data)
    }

    getData()
  }, [propertyId])

  return forms?.length ? (
    <>
      <Typography variant='h4'>Form filed on:</Typography>
      <List>
        {forms.map(form => (
          <ListItemText key={form.id}>
            <Link to={`${form.id}`}>
              {new Date(form.submitted).toLocaleDateString('en-US')}
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
