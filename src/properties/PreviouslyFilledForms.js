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
      <Typography variant='h4'>Filings</Typography>
      <List>
        {forms.map(form => (
          <ListItemText key={form.id}>
            Created:
            <Link to={`${form.id}`}>
              {new Date(form.created_at).toLocaleDateString('en-US')}
            </Link>
            {form.submitted && (
              <span>
                {' '}
                Filed:
                {new Date(form.submitted).toLocaleDateString('en-US')}
              </span>
            )}
          </ListItemText>
        ))}
      </List>
    </>
  ) : (
    <Alert severity='info'>No forms previously filed</Alert>
  )
}

export default PreviouslyFilledForms
