import React, {FC} from 'react';
import {Column, useExpanded, usePagination, useTable} from 'react-table';
import {
  chakra,
  Text,
  Flex,
  IconButton,
  Tooltip,
  Select,
  Box,
  Spinner,
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';

type StakingTableProps = {
  columns: Column[];
  data: any[];
  renderDetail: Function;
  isLoading: boolean;
};

export const StakingTable: FC<StakingTableProps> = ({
  columns,
  data,
  renderDetail,
  isLoading,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    page,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable(
    {columns, data, initialState: {pageIndex: 0}},
    useExpanded,
    usePagination,
  );
  return (
    <>
      <Box overflowX={'auto'}>
        <chakra.table width={'full'} variant="simple" {...getTableProps()}>
          <chakra.thead textAlign={'justify'}>
            {headerGroups.map(headerGroup => (
              <chakra.tr h={16} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <chakra.th px={3} py={3} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </chakra.th>
                ))}
              </chakra.tr>
            ))}
          </chakra.thead>
          {!isLoading && (
            <chakra.tbody {...getTableBodyProps()}>
              {page.map((row: any, i) => {
                prepareRow(row);
                return [
                  <chakra.tr
                    borderWidth={1}
                    h={16}
                    key={i}
                    {...row.getRowProps()}>
                    {row.cells.map((cell: any, index: number) => {
                      return (
                        <chakra.td
                          px={3}
                          py={3}
                          key={index}
                          {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </chakra.td>
                      );
                    })}
                  </chakra.tr>,
                  // If the row is in an expanded state, render a row with a
                  // column that fills the entire length of the table.
                  row.isExpanded ? (
                    <chakra.tr borderWidth={1} h={10} key={i} m={0}>
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
          )}
        </chakra.table>
        {isLoading && (
          <Flex height={'70vh'} justifyContent={'center'} alignItems={'center'}>
            <Spinner />
          </Flex>
        )}
        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
        <Flex justifyContent="flex-end" my={4} alignItems="center">
          <Flex>
            {/* <Tooltip label="First Page">
            <IconButton
              aria-label={'First Page'}
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
            />
          </Tooltip> */}
            <Tooltip label="Previous Page">
              <IconButton
                aria-label={'Previous Page'}
                onClick={previousPage}
                isDisabled={!canPreviousPage || isLoading}
                size={'sm'}
                mr={4}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>

          <Flex alignItems="center">
            <Text flexShrink={0} mr={8}>
              Page{' '}
              <Text fontWeight="bold" as="span">
                {pageIndex + 1}
              </Text>{' '}
              of{' '}
              <Text fontWeight="bold" as="span">
                {pageOptions.length}
              </Text>
            </Text>
            {/* <Text flexShrink={0}>Go to page:</Text>{' '}
          <NumberInput
            ml={2}
            mr={8}
            w={28}
            min={1}
            max={pageOptions.length}
            onChange={(value: any) => {
              const page = value ? value - 1 : 0;
              gotoPage(page);
            }}
            defaultValue={pageIndex + 1}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput> */}
            <Select
              w={28}
              size={'sm'}
              value={pageSize}
              disabled={isLoading}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}>
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </Flex>

          <Flex>
            <Tooltip label="Next Page">
              <IconButton
                aria-label={'Next Page'}
                onClick={nextPage}
                size={'sm'}
                isDisabled={!canNextPage || isLoading}
                icon={<ChevronRightIcon h={6} w={6} />}
                ml={4}
              />
            </Tooltip>
            {/* <Tooltip label="Last Page">
            <IconButton
              aria-label={'Last Page'}
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
            />
          </Tooltip> */}
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

// @todo (isaac): add mobile table
// const MobileTable = () => {
//   return;
// };
