import { useEffect, useState } from 'react'

export const useData = ({
  supabaseFn,
  onError = err => console.log(err),
  onSuccess = () => {},
  ...rest
}) => {
  const [data, setData] = useState()
  const [refresh, setRefresh] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      console.log(rest?.name, 'called for data')
      const { data, error } = await supabaseFn()
      if (error != null) {
        console.log('error with fetching data', { error })
        onError(error)
      } else {
        onSuccess(data)
        setData(data)
      }
      setLoading(false)
      setLoaded(true)
    }

    if (!loading && refresh) {
      getData()
      setRefresh(false)
    }
  }, [refresh])

  return { data, loaded, loading, refresh, setRefresh }
}
