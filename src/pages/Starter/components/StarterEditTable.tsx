import {FC, useState, useRef} from 'react';
import {
  Column,
  useExpanded,
  usePagination,
  useTable,
  useSortBy,
} from 'react-table';
import {
  Text,
  Flex,
  // IconButton,
  // Tooltip,
  Select,
  Box,
  Avatar,
  useColorMode,
  Center,
  Image,
} from '@chakra-ui/react';
import {NavLink, useRouteMatch} from 'react-router-dom';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect} from 'react';

import {selectTableType} from 'store/table.reducer';
import {chakra} from '@chakra-ui/react';

type StarterEditTableProps = {
  columns: Column[];
  data: any[];
  address: string | undefined;
};

export const StarterEditTable: FC<StarterEditTableProps> = ({
  columns,
  data,
  address,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    page,
    nextPage,
    previousPage,
    // setPageSize,
    // state: {pageIndex, pageSize},
  } = useTable(
    {columns, data, initialState: {pageIndex: 0}},
    useSortBy,
    useExpanded,
    usePagination,
  );
  const {colorMode} = useColorMode();
  const focusTarget = useRef<any>([]);

  const {
    data: {contractAddress},
  } = useAppSelector(selectTableType);
  console.log(data)
  const match = useRouteMatch('/');
  return (
    <Flex w="1100px" flexDir={'column'}>
      <Flex justifyContent={'flex-end'} mb={'15px'}>
        <NavLink to={`/createstarter`}>Create</NavLink>
      </Flex>
      <Box>
        <chakra.table
          width={'full'}
          variant="simple"
          {...getTableProps()}
          display="flex"
          flexDirection="column">
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column">
            {page.map((row: any, i) => {
              const {id} = row.original;
              prepareRow(row);
              return [
                <chakra.tr
                  boxShadow={
                    colorMode === 'light'
                      ? '0 1px 1px 0 rgba(96, 97, 112, 0.16)'
                      : ''
                  }
                  ref={(el) => (focusTarget.current[i] = el)}
                  h={16}
                  key={i}
                  onClick={() => {

                  }}
                  cursor={'pointer'}
                  borderRadius={'10px'}
                  mt={'20px'}
                  w="100%"
                  bg={colorMode === 'light' ? 'white.100' : 'black.200'}
                  border={colorMode === 'dark' ? '1px solid #373737' : ''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell: any, index: number) => {
                    const data = cell.row.original;
                    const type = cell.column.id;
                    return (
                      <NavLink
                        to={`/starteredit/${data.tokenAddress}`}
                        // params={{ address: data.tokenAddress}}
                      >
                        <chakra.td
                          px={3}
                          py={3}
                          key={index}
                          m={0}
                          w={
                            type === 'name'
                              ? '280px'
                              : type === 'max_allocation'
                              ? '200px'
                              : type === 'fee'
                              ? ''
                              : '280px'
                          }
                          display="flex"
                          alignItems="center"
                          fontSize={type === 'name' ? '15px' : '13px'}
                          fontWeight={type === 'name' ? 600 : 0}
                          {...cell.getCellProps()}
                        >
                          {type === 'name' ? (
                            <>
                              <Text
                                mr={3}
                                color={
                                  colorMode === 'light' ? '#86929d' : '#949494'
                                }>
                                Name
                              </Text>
                              <Text>
                                {data.name}
                              </Text>
                            </>
                          ) : (
                            ''
                          )}
                          {type === 'max_allocation' ? (
                            <>
                              <Text
                                mr={3}
                                color={
                                  colorMode === 'light' ? '#86929d' : '#949494'
                                }>
                                Max Allocation
                              </Text>
                              <Text>
                                {data.maxAllocation}
                              </Text>
                            </>
                          ) : (
                            ''
                          )}
                          {type === 'funding_token' ? (
                            <>
                              <Text
                                mr={3}
                                color={
                                  colorMode === 'light' ? '#86929d' : '#949494'
                                }>
                                Name
                              </Text>
                              <Text>
                                {data.stakedToken}
                              </Text>
                            </>
                          ) : (
                            ''
                          )}
                        </chakra.td>
                      </NavLink>
                    )
                  })}
                </chakra.tr>
              ]
            })}
          </chakra.tbody>
        </chakra.table>
      </Box>
    </Flex>
  )
}