import DeleteIcon from '@mui/icons-material/Delete'
import {
  Alert,
  Checkbox,
  IconButton,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

import ConfirmRemoveDialog from '../components/ConfirmRemoveDialog'

const Table = ({ data, columns, showCheckbox, checkboxAction, getter }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState()
  const [selectedData, setSelectedData] = useState([])
  const [updateData, setUpdateData] = useState(false)
  const handleDelete = () => {
    setShowDeleteDialog(true)
  }
  const handleChange =
    selectedRow =>
    ({ target: { checked } }) => {
      setSelectedData(selected =>
        checked
          ? selected.indexOf(data => data.id === selectedRow.id) < 0
            ? [...selected, selectedRow]
            : selected
          : selected.filter(({ id }) => id !== selectedRow.id)
      )
    }

  useEffect(() => {
    if (updateData) {
      console.log('refresh the data here')
    }
  }, [updateData])

  return !data || data.length === 0 ? (
    <Alert severity='info'>No data to display</Alert>
  ) : (
    <>
      {showDeleteDialog && (
        <ConfirmRemoveDialog
          getter={getter}
          items={selectedData}
          setOpen={setShowDeleteDialog}
          setUpdateData={setUpdateData}
        />
      )}
      <MuiTable size='small'>
        <TableHead>
          <TableRow>
            {showCheckbox && (
              <TableCell>
                {selectedData.length && checkboxAction === 'remove' ? (
                  <IconButton onClick={handleDelete}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </TableCell>
            )}
            {columns.map(({ user_id, name, label, CellProps }) => (
              <TableCell key={user_id || name} {...CellProps}>
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => {
            const { id } = item
            return (
              <TableRow key={id}>
                {showCheckbox && (
                  <TableCell>
                    <Checkbox
                      checked={
                        selectedData.findIndex(item => item.id === id) > -1
                      }
                      onChange={handleChange(item)}
                    />
                  </TableCell>
                )}
                {columns.map(
                  ({
                    defaultValue,
                    name,
                    CellProps,
                    Renderer,
                    RendererProps,
                  }) =>
                    Renderer ? (
                      <Renderer
                        item={item}
                        key={name}
                        {...CellProps}
                        {...RendererProps}
                      />
                    ) : (
                      <TableCell key={name} {...CellProps}>
                        {item?.[name] || defaultValue}
                      </TableCell>
                    )
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </MuiTable>
    </>
  )
}

Table.propTypes = {
  checkboxAction: PropTypes.oneOf(['remove', 'manager', 'notify']),
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  getter: PropTypes.func.isRequired,
  showCheckbox: PropTypes.bool,
}
export default Table
