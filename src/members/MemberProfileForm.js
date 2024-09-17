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
import RoleSelect from '../components/RoleSelect'
import { useEffect, useState } from 'react'
import DocumentTypeDropdown from '../components/DocumentTypeDropdown'
import LocalTribalDropdown from '../components/LocalTribalDropdown'

const MemberProfileForm = () => {
  const navigate = useNavigate()
  const { countriesByName } = usePropertiesContext()
  const { currentUser, setRefresh } = usePropertyContext() || {}
  const { setRefresh: setProfilesRefresh } = useAuth()
  const { propertyId, userId } = useParams()
  const [propertyRole, setPropertyRole] = useState('')
  const [documentType, setDocumentType] = useState('')
  const [tribe, setTribe] = useState(null)
  const handlePropertyRoleChange = (_, v) => {
    setPropertyRole(v)
  }

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
          document_jurisdiction_local_tribal_id:
            tribe !== null ? tribe.id : null,
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

  const handleDocumentChange = (e, v) => {
    setDocumentType(v.props.value)
    if (v.props.value !== 38) {
      setTribe(null)
    }
  }

  const handleTribeChange = (e, v) => {
    setTribe(v)
  }
  useEffect(() => {
    if (currentUser?.property_role) {
      setPropertyRole(currentUser.property_role)
    }
  }, [currentUser?.property_role])

  useEffect(() => {
    if (
      currentUser?.document_type &&
      currentUser?.document_type !== documentType
    ) {
      setDocumentType(currentUser?.document_type)
    }
  }, [currentUser?.document_type])

  useEffect(() => {
    if (
      currentUser?.document_jurisdiction_local_tribal_id &&
      currentUser?.document_jurisdiction_local_tribal_id !== tribe
    ) {
      setTribe({
        id: currentUser?.document_jurisdiction_local_tribal_id,
        value: currentUser?.code,
      })
    }
  }, [currentUser?.document_jurisdiction_local_tribal_id])

  if (!currentUser) return <div>Loading...</div>

  return (
    <Form onSubmit={handleSave}>
      <RoleSelect value={propertyRole} onChange={handlePropertyRoleChange} />
      <br />
      <h3>Edit Information</h3>
      {propertyRole !== 'nonreporting' ? (
        <>
          {groups.map(({ fields, groupLabel }) => (
            <Stack key={groupLabel} spacing={2} width='100%' mb={5}>
              <h4>{groupLabel}</h4>

              {fields.map(item =>
                item.control === 'date' ? (
                  <DatePicker
                    key={item.name}
                    defaultValue={
                      currentUser[item.name]
                        ? dayjs(currentUser[item.name])
                        : null
                    }
                    {...item}
                  />
                ) : item.name.includes('country_jurisdiction') ? (
                  <CountryDropdown
                    defaultValue={currentUser[item.name]}
                    name={item.name}
                  />
                ) : item.name === 'document_type' ? (
                  <DocumentTypeDropdown
                    onChange={handleDocumentChange}
                    value={documentType}
                  />
                ) : item.name === 'document_jurisdiction_local_tribal_id' ? (
                  <LocalTribalDropdown
                    value={tribe}
                    name={item.name}
                    disabled={documentType !== 38}
                    onChange={handleTribeChange}
                  />
                ) : item.name === 'document_jurisdiction_other_description' ? (
                  <TextField
                    key={item.name}
                    fullWidth
                    {...item}
                    disabled={documentType !== 38 || tribe?.id !== 588}
                    defaultValue={currentUser[item.name]}
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
          ))}{' '}
          <Upload />
        </>
      ) : (
        <TextField fullWidth name='email' defaultValue={currentUser?.email} />
      )}
    </Form>
  )
}

export default MemberProfileForm
