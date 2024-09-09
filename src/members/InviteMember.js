import { Button, Link, Stack } from '@mui/material'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import MemberForm from './MemberForm'

const InviteMember = () => {
  const location = useLocation()
  const [copied, setCopiedState] = useState()
  const [membersCount, setMembersCount] = useState(1)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(location?.pathname).then(
      () => {
        setCopiedState(true)
        setTimeout(() => {
          setCopiedState(false)
        }, 500)
      },
      () => {
        console.error('Failed to copy')
        /* Rejected - text failed to copy to the clipboard */
      }
    )
  }

  const handleAddMember = () => {
    setMembersCount(count => count + 1)
  }
  return (
    <Stack sx={{ img: { maxHeight: 200 } }}>
      {/* TODO: generate QR code links */}
      {/* <Link onClick={handleCopyLink}>Copy Link</Link>
      {copied && <span> Copied!</span>} */}
      <p>
        Complete the following fields to send a link to invite members to the
        property.
      </p>
      <MemberForm count={membersCount} />
      <Button color='secondary' onClick={handleAddMember} variant='contained'>
        Add Member
      </Button>
    </Stack>
  )
}

export default InviteMember
