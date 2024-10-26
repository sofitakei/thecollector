import { useEffect, useState } from 'react'

export const useData = ({
  supabaseFn,
  onError = err => console.log(err),
  onSuccess = () => {},
}) => {
  const [data, setData] = useState()
  const [refresh, setRefresh] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      const { data, error } = await supabaseFn()
      if (error != null) {
        console.log('error with fetching data', { error })
        setRefresh(false)
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
  }, [loading, onError, onSuccess, refresh, supabaseFn])

  return { data, loaded, loading, refresh, setRefresh }
}
