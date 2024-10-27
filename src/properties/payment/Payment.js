import { Button, CircularProgress, Stack } from '@mui/material'
import { useEffect, useState } from 'react'

import LoadingBackdrop from '../../components/LoadingBackdrop'
import PropertyDashboardButton from '../../components/PropertyDashboardButton'
import { useAuth } from '../../contexts/AuthContext'
import { usePropertyContext } from '../../contexts/PropertyContext'
import { supabase } from '../../supabaseClient'
import ConfirmInvoiceDialog from './ConfirmInvoice'

export const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})
//TODO: get these prices in a different way
export const serviceTiers = ['Standard', 'Facilitated', 'Comprehensive']
const Payment = () => {
  const { userProfile } = useAuth()
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [products, setProducts] = useState([])
  const { filing } = usePropertyContext() || {}
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState()

  const handleBuyNow = (priceId, product) => async () => {
    setPaymentProcessing(true)
    const { data } = await supabase.functions.invoke('create-stripe-checkout', {
      body: {
        product,
        filing_id: filing?.id,
        priceId,
        user_id: userProfile.id,
        url: window.location.origin,
      },
    })

    window.location.href = data.url
  }

  const handleSelectedProduct = id => () => {
    setSelectedProduct(id)
  }

  const handleCloseInvoiceDialog = () => {
    setInvoiceDialogOpen(false)
    setSelectedProduct(undefined)
  }

  useEffect(() => {
    if (selectedProduct) {
      setInvoiceDialogOpen(true)
    } else {
      setInvoiceDialogOpen(false)
    }
  }, [selectedProduct])

  useEffect(() => {
    const getData = async () => {
      setLoadingProducts(true)
      const { data, error } = await supabase.functions.invoke(
        'stripe-get-price-products',
        { method: 'GET' }
      )
      setProducts(data.productPriceData.data)
      setLoadingProducts(false)
      console.log(error)
    }
    if (!loadingProducts && products?.length === 0) {
      getData()
    }
  }, [loadingProducts, products.length])

  const serviceProducts = products.filter(({ product: { name } }) =>
    serviceTiers.includes(name)
  )
  return (
    <div>
      <h1>Payment Page</h1>
      <Stack direction='row' width='100%' justifyContent='center' spacing={4}>
        {serviceProducts.length === 0 ? (
          <CircularProgress />
        ) : (
          serviceProducts.map(
            ({ id, product, product: { name, description }, unit_amount }) => (
              <Stack width='20%' key={id}>
                <h4>{name}</h4>
                <p>{description}</p>
                <strong> {usdFormatter.format(unit_amount / 100)}</strong>
                <Button variant='contained' onClick={handleBuyNow(id, product)}>
                  Pay Now
                </Button>
                OR
                <Button onClick={handleSelectedProduct(id)}>
                  Send Invoice
                </Button>
              </Stack>
            )
          )
        )}
      </Stack>

      <br />
      <br />
      <PropertyDashboardButton />
      <ConfirmInvoiceDialog
        onClose={handleCloseInvoiceDialog}
        open={invoiceDialogOpen}
        product={products?.find(({ id }) => id === selectedProduct)}
      />
      <LoadingBackdrop open={paymentProcessing} />
    </div>
  )
}

export default Payment
