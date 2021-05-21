import {FC} from 'react';
import {Column, useExpanded, useTable} from 'react-table';
import {chakra} from '@chakra-ui/react';

type TableProps = {
  columns: Column[];
  data: any[];
  renderDetail: Function;
};

export const Table: FC<TableProps> = ({columns, data, renderDetail}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable({columns, data}, useExpanded);
  return (
    <chakra.table width={'full'} variant="simple" {...getTableProps()}>
      <chakra.thead textAlign={'justify'}>
        {headerGroups.map(headerGroup => (
          <chakra.tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <chakra.th {...column.getHeaderProps()}>
                {column.render('Header')}
              </chakra.th>
            ))}
          </chakra.tr>
        ))}
      </chakra.thead>
      <chakra.tbody {...getTableBodyProps()}>
        {rows.map((row: any, i) => {
          prepareRow(row);
          return [
            <chakra.tr borderWidth={1} h={10} key={i} {...row.getRowProps()}>
              {row.cells.map((cell: any, index: number) => {
                return (
                  <chakra.td px={3} py={3} key={index} {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </chakra.td>
                );
              })}
            </chakra.tr>,
            // If the row is in an expanded state, render a row with a
            // column that fills the entire length of the table.
            row.isExpanded ? (
              <chakra.tr key={i} m={0}>
                <chakra.td margin={0} colSpan={visibleColumns.length}>
                  {/*
                    Inside it, call our renderRowSubComponent function. In reality,
                    you could pass whatever you want as props to
                    a component like this, including the entire
                    table instance. But for this example, we'll just
                    pass the row
                  */}
                  {renderDetail({row})}
                </chakra.td>
              </chakra.tr>
            ) : null,
          ];
        })}
      </chakra.tbody>
    </chakra.table>
  );
};

// @todo (isaac): add mobile table
// const MobileTable = () => {
//   return;
// };
