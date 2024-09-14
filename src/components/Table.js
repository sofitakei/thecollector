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
const NoData = () => <div>No data to display</div>
const Table = ({
  data,
  columns,
  showCheckbox,
  checkboxAction,
  getter,
  table,
  idField,
  NoDataMessage = <NoData />,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState()
  const [selectedData, setSelectedData] = useState([])
  const [updateData, setUpdateData] = useState(false)
  const handleDelete = () => {
    setShowDeleteDialog(true)
  }
  const handleChange =
    selectedRow =>
    ({ target: { checked } }) => {
      console.log('fieldid', idField, selectedRow, checked)
      console.log(
        selectedData,
        selectedData.indexOf(data => data[idField] === selectedRow[idField])
      )
      setSelectedData(selected =>
        checked
          ? selected.indexOf(data => data[idField] === selectedRow[idField]) < 0
            ? [...selected, selectedRow]
            : selected
          : selected.filter(item => item[idField] !== selectedRow[idField])
      )
    }

  useEffect(() => {
    if (updateData) {
      console.log('refresh the data here')
    }
  }, [updateData])

  return !data || data.length === 0 ? (
    <Alert severity='info'>{NoDataMessage}</Alert>
  ) : (
    <>
      {showDeleteDialog && (
        <ConfirmRemoveDialog
          getter={getter}
          items={selectedData}
          setOpen={setShowDeleteDialog}
          setUpdateData={setUpdateData}
          table={table}
          idField={idField}
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
            return (
              <TableRow key={item[idField]}>
                {showCheckbox && (
                  <TableCell>
                    <Checkbox
                      checked={
                        selectedData.findIndex(
                          i => i[idField] === item[idField]
                        ) > -1
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
