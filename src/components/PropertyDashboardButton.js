import { Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

const PropertyDashboardButton = () => {
  const navigate = useNavigate()
  const { propertyId } = useParams()
  return (
    <Button
      sx={{ my: 2 }}
      color='secondary'
      variant='outlined'
      onClick={() => navigate(`/properties/${propertyId}`)}>
      Property Dashboard
    </Button>
  )
}

export default PropertyDashboardButton
