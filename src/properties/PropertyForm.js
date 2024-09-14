import { Alert, MenuItem, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import Form from '../components/Form'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import { fields } from './config'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { getFormFields } from '../utils'
import CountryDropdown from '../components/CountryDropdown'
import { useCountries } from '../hooks/useCountries'

const PropertyForm = () => {
  const navigate = useNavigate()
  const { currentProperty, setRefresh } = usePropertiesContext() || {}
  const [errors, setErrors] = useState()
  const {
    userProfile: { id },
  } = useAuth()
  const { countries, countriesByName } = useCountries()

  const handleSubmit = async e => {
    e.preventDefault()
    const formFields = getFormFields(e.target)

    let propertyId = currentProperty?.id
    if (!formFields.name) {
      setErrors('Company field is required')
    } else {
      //TODO: this should be done in the country dropdown component
      const country_id = countriesByName[formFields.country_jurisdiction_id]
      if (!currentProperty) {
        const { data, error } = await supabase.rpc('add_property_with_owner', {
          ...formFields,
          country_jurisdiction_id: country_id,
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
      {errors && (
        <Alert severity='error' sx={{ mb: 2 }}>
          Company Legal Name is required
        </Alert>
      )}
      {fields.map(({ name, options, select, ...rest }) =>
        name === 'country_jurisdiction_id' ? (
          <CountryDropdown name={name} countries={countries} />
        ) : (
          <TextField
            style={{ marginBottom: 20 }}
            fullWidth
            name={name}
            key={name}
            select={select}
            {...rest}
            onFocus={handleFocus}
            defaultValue={currentProperty?.[name] || ''}>
            {select &&
              options?.length &&
              options.map(({ name, id, value }) => (
                <MenuItem key={id} value={value || id}>
                  {name}
                </MenuItem>
              ))}
          </TextField>
        )
      )}
    </Form>
  )
}

export default PropertyForm
