import {
  Alert,
  Checkbox,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import PropTypes from 'prop-types'
import { usePropertyContext } from '../contexts/PropertyContext'
import { usePropertiesContext } from '../contexts/PropertiesContext'

const NoData = () => <div>No data to display</div>

const Table = ({
  data,
  columns,
  showCheckbox,
  getCheckboxEnabled,
  idField,

  NoDataMessage = <NoData />,
}) => {
  const { selectedMembers, setSelectedMembers } = usePropertyContext() || {}
  const { selectedProperties, setSelectedProperties } =
    usePropertiesContext() || {}
  const selectedItems =
    idField == 'userproperty_id' ? selectedMembers : selectedProperties
  const handleChange =
    selectedRow =>
    ({ target: { checked } }) => {
      if (idField == 'userproperty_id') {
        setSelectedMembers(selected =>
          checked
            ? selected.indexOf(
                data => data?.userproperty_id === selectedRow.userproperty_id
              ) < 0
              ? [...selected, selectedRow]
              : selected
            : selected.filter(
                item => item.userproperty_id !== selectedRow.userproperty_id
              )
        )
      } else {
        setSelectedProperties(selected =>
          checked
            ? selected.indexOf(data => data[idField] === selectedRow[idField]) <
              0
              ? [...selected, selectedRow]
              : selected
            : selected.filter(item => item[idField] !== selectedRow[idField])
        )
      }
    }

  return !data || data.length === 0 ? (
    <Alert severity='info'>{NoDataMessage}</Alert>
  ) : (
    <>
      <MuiTable size='small'>
        <TableHead>
          <TableRow>
            {showCheckbox && <TableCell sx={{ width: '1%' }}></TableCell>}
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
                      disabled={!getCheckboxEnabled(item)}
                      checked={
                        selectedItems.findIndex(
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
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  showCheckbox: PropTypes.bool,
}
export default Table
