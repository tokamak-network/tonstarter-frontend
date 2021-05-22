import {FC} from 'react';
import {Column, useExpanded, useTable} from 'react-table';
import {chakra, Skeleton} from '@chakra-ui/react';

type StakingTableProps = {
  columns: Column[];
  data: any[];
};

export const StakingSkeleton: FC<StakingTableProps> = ({columns, data}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
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
                    <Skeleton h={5}/>
                  </chakra.td>
                );
              })}
            </chakra.tr>,
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
