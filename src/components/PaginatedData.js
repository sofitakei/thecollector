import { Pagination, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import Table from '../components/Table'

const LIMIT = 15

const PaginatedData = ({ supabaseFn, countSupabaseFn, TableProps, limit }) => {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [data, setData] = useState([])

  const perPage = limit || LIMIT

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabaseFn.range(
        perPage * (page - 1),
        perPage * page
      )

      setData(data)
    }
    getData()
  }, [page, perPage, supabaseFn])

  useEffect(() => {
    const getData = async () => {
      const { count } = await countSupabaseFn
      setTotal(count)
    }
    getData()
  }, [countSupabaseFn])

  const handleChange = (e, v) => {
    setPage(v)
  }

  return (
    <>
      <Table {...TableProps} data={data} />
      {total > LIMIT && (
        <>
          <Typography>Page: {page}</Typography>
          <Pagination
            count={Math.ceil(total / LIMIT)}
            page={page}
            onChange={handleChange}
          />
        </>
      )}
    </>
  )
}
PaginatedData.propTypes = {
  limit: PropTypes.number,
  TableProps: PropTypes.object.isRequired,
  supabaseFn: PropTypes.object.isRequired,
  countSupabaseFn: PropTypes.object.isRequired,
}

export default PaginatedData
