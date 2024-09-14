import { Button } from '@mui/material'
import { Link, useParams } from 'react-router-dom'

const Payment = () => {
  const { propertyId } = useParams()
  return (
    <div>
      <h1>Payment Page</h1>
      <h4>Coming soon</h4>

      <Button variant='outlined'>Pay</Button>
      <br />
      <br />
      <Link to={`/properties/${propertyId}`}>Property Dashboard</Link>
    </div>
  )
}

export default Payment
