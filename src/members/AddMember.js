import { Divider } from '@mui/material'
import MemberForm from './MemberForm'
import SearchMember from './SearchMember'

const AddMember = () => {
  return (
    <>
      <SearchMember />
      <Divider>OR</Divider>
      <h2>Add New Member</h2>
      <MemberForm />
    </>
  )
}

export default AddMember
