import { Alert, MenuItem, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import Form from '../components/Form'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import { fields } from './config'
import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { getFormFields } from '../utils'
const PropertyForm = () => {
  const navigate = useNavigate()
  const { currentProperty, setRefresh } = usePropertiesContext() || {}
  const [errors, setErrors] = useState()
  const {
    userProfile: { id },
  } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()
    const formFields = getFormFields(e.target)
    let propertyId = currentProperty?.id
    if (!formFields.name) {
      setErrors('Company field is required')
    } else {
      if (!currentProperty) {
        const { data, error } = await supabase.rpc('add_property_with_owner', {
          ...formFields,
          created_by: id,
        })
        propertyId = data?.[0]?.id
      } else {
        const { data, error } = await supabase
          .from('properties')
          .update(formFields)
          .eq('id', currentProperty.id)
      }
      setRefresh(true)
      if (propertyId) {
        navigate(`/properties/${propertyId}/invite`)
      }
    }
  }
  const handleFocus = () => {
    setErrors()
  }

  return (
    <Form onSubmit={handleSubmit}>
      {errors && <Alert severity='error'>Company Legal Name is required</Alert>}
      {fields.map(({ name, select, options, ...rest }) => (
        <TextField
          style={{ marginBottom: 20 }}
          fullWidth
          name={name}
          select={select}
          key={name}
          {...rest}
          onFocus={handleFocus}
          defaultValue={currentProperty?.[name] || ''}>
          {select &&
            options?.length &&
            options.map(({ name, id }) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
        </TextField>
      ))}
    </Form>
  )
}

export default PropertyForm
