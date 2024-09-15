import { TextField } from '@mui/material'
import { supabase } from '../supabaseClient'

const EmailField = props => {
  const { onChange, setError, ...rest } = props

  const handleBlur = async e => {
    const {
      target: { value },
    } = e
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', value)
    if (data?.length) {
      setError('email already exists')
    }
  }
  return <TextField fullWidth onBlur={handleBlur} name='email' {...rest} />
}

export default EmailField
