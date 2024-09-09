import CloudUploadIcon from '@mui/icons-material/CloudUpload'
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
import { styled } from '@mui/material/styles'
import { useNavigate, useParams } from 'react-router-dom'

import Form from '../components/Form'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import { stakeholders } from '../properties/config'
import { groups } from './config'
import { supabase } from '../supabaseClient'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { getFormFields } from '../utils'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const MemberProfileForm = () => {
  const navigate = useNavigate()
  const { currentUser, setRefresh } = usePropertiesContext()
  const { propertyId, userId } = useParams()
  const handleSave = async e => {
    e.preventDefault()
    const { property_role, ...formFields } = getFormFields(e.target)
    const { data, error } = await supabase
      .from('profiles')
      .update(formFields)
      .eq('id', userId)
    if (!error) {
      await supabase
        .from('userproperty')
        .update({ property_role })
        .eq('user_id', userId)
        .eq('property_id', propertyId)
      setRefresh(true)
      navigate(`/properties/${propertyId}/users/${userId}`)
    } else {
      console.log({ error })
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
            ) : (
              <TextField
                key={item.name}
                fullWidth
                {...item}
                defaultValue={currentUser[item.name]}
              />
            )
          )}
        </Stack>
      ))}

      <Button
        component='label'
        role={undefined}
        startIcon={<CloudUploadIcon />}
        tabIndex={-1}
        variant='contained'>
        Upload file
      </Button>
      <VisuallyHiddenInput type='file' />
    </Form>
  )
}

export default MemberProfileForm
