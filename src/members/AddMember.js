import { useNavigate, useParams } from 'react-router-dom'

import MemberForm from './MemberForm'
import { supabase } from '../supabaseClient'
import { usePropertiesContext } from '../contexts/PropertiesContext'
import { getFormFields } from '../utils'
const AddMember = () => {
  const navigate = useNavigate()
  const { propertyId } = useParams()
  const { currentProperty, setRefresh } = usePropertiesContext()

  const handleSubmit = async e => {
    e.preventDefault()
    const formFields = getFormFields(e.target)
    const { is_manager, ...rest } = formFields
    const { data, error } = await supabase.rpc('add_member_to_property', {
      property_id: currentProperty?.property_id,
      ...formFields,
      is_manager: is_manager === 'on' ? true : false,
    })
    console.log('added member', { error, data })
    setRefresh(true)
    const userId = data?.[0].id
    if (userId) {
      navigate(
        `/properties/${currentProperty?.property_id}/users/${userId}/edit`
      )
    }
  }
  return (
    <MemberForm
      FormProps={{ buttonLabel: 'Save', onSubmit: handleSubmit }}
      overrides={{ lastName: { required: true }, email: { required: false } }}
    />
  )
}

export default AddMember
