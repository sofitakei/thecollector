import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  TextField,
} from '@mui/material'

import { useNavigate, useParams } from 'react-router-dom'

import Form from '../components/Form'
import { stakeholders } from '../properties/config'
import { groups } from './config'
import { supabase } from '../supabaseClient'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { getFormFields } from '../utils'
import isEqual from 'react-fast-compare'
import { useAuth } from '../contexts/AuthContext'
import { usePropertyContext } from '../contexts/PropertyContext'
import CountryDropdown from '../components/CountryDropdown'
import Upload from '../components/Upload'
import { usePropertiesContext } from '../contexts/PropertiesContext'

const MemberProfileForm = () => {
  const navigate = useNavigate()
  const { countriesByName } = usePropertiesContext()
  const { currentUser, setRefresh } = usePropertyContext() || {}
  const { setRefresh: setProfilesRefresh } = useAuth()
  const { propertyId, userId } = useParams()

  const handleSave = async e => {
    e.preventDefault()
    const {
      property_role,
      country_jurisdiction,
      document_country_jurisdiction,
      document_jurisdiction_local_tribal,
      ...formFields
    } = getFormFields(e.target)

    const {
      auth_user_id,
      id,
      user_id,
      userproperty_id,
      userproperty_filing,
      is_manager,
      updated_at,
      property_role: pr,
      ...originalUser
    } = currentUser
    if (!isEqual(formFields, originalUser)) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...formFields,
          document_country_jurisdiction_id:
            countriesByName?.[document_country_jurisdiction] || null,
          country_jurisdiction_id:
            countriesByName?.[country_jurisdiction] || null,
        })
        .eq('id', userId)
      //TODO as trigger?
      const { error: voidStatusError } = await supabase
        .from('userproperty_filing')
        .update({ status: 'void' })
        .eq('userproperty_id', userproperty_id)

      if (!error) {
        await supabase
          .from('userproperty')
          .update({ property_role })
          .eq('user_id', userId)
          .eq('property_id', propertyId)
        setRefresh(true)
        setProfilesRefresh(true)
        navigate(`/properties/${propertyId}/users/${userId}`)
      } else {
        console.log({ error })
      }
    } else {
      navigate(`/properties/${propertyId}/users/${userId}`)
    }
  }

  if (!currentUser) return <div>Loading...</div>

  return (
    <Form onSubmit={handleSave}>
      <FormControl>
        <FormLabel id='demo-radio-buttons-group-label'>Stake</FormLabel>
        <RadioGroup
          row
          aria-labelledby='demo-radio-buttons-group-label'
          defaultValue={currentUser?.property_role}
          name='property_role'>
          {stakeholders.map(({ name, label }) => (
            <FormControlLabel
              control={<Radio />}
              key={name}
              value={name}
              label={label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <br />
      <h3>Edit Information</h3>

      {groups.map(({ fields, groupLabel }) => (
        <Stack key={groupLabel} spacing={2} width='100%' mb={5}>
          <h4>{groupLabel}</h4>

          {fields.map(item =>
            item.control === 'date' ? (
              <DatePicker
                key={item.name}
                defaultValue={
                  currentUser[item.name] ? dayjs(currentUser[item.name]) : null
                }
                {...item}
              />
            ) : item.name.includes('country_jurisdiction') ? (
              <CountryDropdown
                defaultValue={currentUser[item.name]}
                name={item.name}
              />
            ) : (
              <TextField
                key={item.name}
                fullWidth
                {...item}
                defaultValue={currentUser[item.name]}
                disabled={item.name === 'email'}
              />
            )
          )}
        </Stack>
      ))}
      <Upload />
    </Form>
  )
}

export default MemberProfileForm
