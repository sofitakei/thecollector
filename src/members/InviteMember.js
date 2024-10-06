import { Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import MemberForm from './MemberForm'
import { qrcode, drawingSVG } from 'bwip-js'
import PropertyDashboardButton from '../components/PropertyDashboardButton'

const InviteMember = () => {
  const [copied, setCopiedState] = useState()
  const [membersCount, setMembersCount] = useState(1)
  const { propertyId } = useParams()
  const encoded = btoa(JSON.stringify({ propertyId }))
  const link = location?.host + '?' + encoded
  let svg = qrcode(
    {
      bcid: 'code128', // Barcode type
      text: link, // Text to encode
      height: 12, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this
      textcolor: 'ff0000', // Red text
    },
    drawingSVG()
  )
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link).then(
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
  const handleRemoveMember = idx => () => {
    setMembersCount(count => count - 1)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <Stack
      sx={{
        '.qrcode': { alignSelf: 'center', height: 100, width: 100 },
      }}>
      <div className='qrcode' dangerouslySetInnerHTML={{ __html: svg }} />
      <Link onClick={handleCopyLink}>Copy Link</Link>
      {copied && <span> Copied!</span>}
      <p>
        Complete the following fields to send a link to invite members to the
        property.
      </p>

      <MemberForm
        count={membersCount}
        allowMultiple
        handleAddMember={handleAddMember}
        handleRemoveMember={handleRemoveMember}
      />
      <PropertyDashboardButton />
    </Stack>
  )
}

export default InviteMember
