import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Fragment, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Form from '../components/Form'
import { useAuth } from '../contexts/AuthContext'
import { usePropertyContext } from '../contexts/PropertyContext'
import { supabase } from '../supabaseClient'
import { checkEmailExists, checkForDuplicates, getFormFields } from '../utils'

const fields = [
  { name: 'first_name', label: 'First Name', required: true },
  { name: 'last_name', label: 'Last Name' },
  { name: 'email', label: 'Email', required: true },
  { name: 'is_manager', label: 'Add as Manager', checkbox: true },
  {
    name: 'property_role',
    label: 'Property Role',
    select: true,
    required: true,
    options: [
      { id: 'board_member', label: 'Board Member' },
      { id: 'owner', label: 'Owns 25% or More' },
      { id: 'nonreporting', label: 'Non-reporting' },
    ],
  },
]

const MemberForm = ({
  count = 1,
  overrides,
  allowMultiple = false,
  handleAddMember,
  handleRemoveMember,
}) => {
  const { setRefresh } = usePropertyContext()
  const { setRefresh: setRefreshProfile } = useAuth()
  const { propertyId } = useParams()
  const [saveDisabled, setSaveDisabled] = useState()
  const [error, setError] = useState()
  const navigate = useNavigate()

  // const handleBlur = async ({ target: { value } }) => {
  //   const emailExists = await checkEmailExists(value)
  //   if (emailExists) {
  //     setSaveDisabled(true)
  //     setError(
  //       `The email is already in use: ${value}.  Try the search function above to add them`
  //     )
  //   }
  // }

  const handleFocus = () => {
    setError(null)
    setSaveDisabled(false)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (error) {
      return
    }
    if (!saveDisabled) {
      setError(null)
      setSaveDisabled(true)
      const formFields = getFormFields(e.target)
      const members = [...Array(count).keys()].map((_, idx) => {
        const memberFields = Object.keys(formFields).filter(key =>
          key.endsWith(`_${idx}`)
        )

        return memberFields.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.replace(`_${idx}`, '')]: curr.includes('is_manager')
              ? formFields[curr] === 'on'
                ? true
                : false
              : formFields[curr],
          }),
          {}
        )
      })

      const hasDuplicateEmails = checkForDuplicates(
        members.map(({ email }) => email)
      )
      if (
        members.some(
          ({ email, first_name, property_role }) =>
            !email || !first_name || !property_role
        )
      ) {
        setSaveDisabled(false)
        setError('First name, email, and role are required')
        return
      }

      if (hasDuplicateEmails) {
        setError('Please check you have no duplicate emails')
        setSaveDisabled(true)
        return
      }
      const membersToMail = members.filter(
        async ({ email }) => await !checkEmailExists(email)
      )

      await supabase.rpc('invite_members_to_property', {
        members,
        propertyid: parseInt(propertyId),
      })

      membersToMail.forEach(async ({ email }) => {
        await supabase.functions.invoke('email', {
          body: { email },
        })
      })

      setRefresh(true)
      setRefreshProfile(true)

      navigate(`/properties/${propertyId}/payment`)
    }
  }

  return (
    <Form buttonLabel='Send' disabled={saveDisabled} onSubmit={handleSubmit}>
      {error && <Alert severity='error'>{error}</Alert>}
      <Stack width='100%' spacing={2}>
        {[...Array(count).keys()].map((_, idx) => (
          <Stack spacing={2} key={idx}>
            {allowMultiple && idx < count && (
              <Divider>
                Member {idx + 1}{' '}
                {idx > 0 && (
                  <IconButton onClick={handleRemoveMember}>
                    <CloseIcon />
                  </IconButton>
                )}
              </Divider>
            )}
            {fields.map(
              ({ name, label, checkbox, options, select, required }) => (
                <Fragment key={`${name}_${idx}`}>
                  {checkbox ? (
                    <FormControlLabel
                      control={<Checkbox />}
                      label={label}
                      name={`${name}_${idx}`}
                      default
                    />
                  ) : (
                    <TextField
                      onFocus={handleFocus}
                      fullWidth
                      label={label}
                      name={`${name}_${idx}`}
                      required={required}
                      select={select}
                      defaultValue=''
                      {...overrides?.[name]}>
                      {options?.map(({ label, id }) => (
                        <MenuItem key={id} value={id}>
                          {label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Fragment>
              )
            )}
          </Stack>
        ))}
        {allowMultiple && (
          <Button
            color='secondary'
            onClick={handleAddMember}
            variant='contained'>
            Add Member
          </Button>
        )}
      </Stack>
    </Form>
  )
}
MemberForm.propTypes = {
  count: PropTypes.number,
  overrides: PropTypes.object,
  FormProps: PropTypes.object,
  allowMultiple: PropTypes.bool,
  handleAddMember: PropTypes.func,
  handleRemoveMember: PropTypes.func,
}
export default MemberForm
