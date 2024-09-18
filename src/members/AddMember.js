import { Divider } from '@mui/material'
import SearchMember from './SearchMember'
import MemberProfileForm from './MemberProfileForm'

const AddMember = () => {
  return (
    <>
      <SearchMember />
      <Divider>OR</Divider>
      <h2>Add New Member</h2>
      <MemberProfileForm newMember />
    </>
  )
}

export default AddMember
