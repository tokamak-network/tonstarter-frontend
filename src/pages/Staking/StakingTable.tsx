import {FC, useState, useRef} from 'react';
import {
  Column,
  useExpanded,
  usePagination,
  useTable,
  useSortBy,
} from 'react-table';
import {
  chakra,
  Skeleton,
  Text,
  Flex,
  IconButton,
  Tooltip,
  Select,
  Box,
  Avatar,
  useColorMode,
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import './staking.css';
import {checkTokenType} from 'utils/token';
import {TriangleUpIcon, TriangleDownIcon} from '@chakra-ui/icons';
import {selectTableType} from 'store/table.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {useCallback} from 'react';
import {current} from '@reduxjs/toolkit';
import {useEffect} from 'react';
import {setTimeout} from 'timers';

type StakingTableProps = {
  columns: Column[];
  data: any[];
  renderDetail: Function;
  isLoading: boolean;
};

const getTextColor = (type: string, colorMode: string) => {
  if (colorMode === 'light') {
    if (type === 'name') {
      return '#304156';
    }
    return '#3a495f';
  } else if (colorMode === 'dark') {
    if (type === 'name') {
      return 'white.100';
    }
    return '#f3f4f1';
  }
};

const getCircle = (type: 'loading' | 'sale' | 'start' | 'end') => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={0} ml={'16px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={
          type === 'loading'
            ? '#C0C0C0'
            : type === 'sale'
            ? '#f95359'
            : type === 'start'
            ? '#ffdc00'
            : '#2ea2f8'
        }></Box>
    </Flex>
  );
};

const getStatus = (
  type: 'sale' | 'start' | 'end',
  colorMode: 'light' | 'dark',
) => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={'20px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={
          type === 'sale' ? '#f95359' : type === 'start' ? '#ffdc00' : '#2ea2f8'
        }
        mr={'7px'}
        mt={'2px'}></Box>
      <Text
        fontSize={'11px'}
        color={colorMode === 'light' ? '#304156' : 'white.100'}>
        {type === 'sale' ? 'On sale' : type === 'start' ? 'started' : 'ended'}
      </Text>
    </Flex>
  );
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
    useSortBy,
    useExpanded,
    usePagination,
  );

  const {colorMode} = useColorMode();
  const focusTarget = useRef<any>([]);

  useEffect(() => {
    console.log(focusTarget.current);
  }, [focusTarget]);

  const {
    data: {contractAddress},
  } = useAppSelector(selectTableType);

  const [isOpen, setIsOpen] = useState(
    contractAddress === undefined ? '' : contractAddress,
  );
  const onChangeSelectBox = (e: any) => {
    const filterValue = e.target.value;
    headerGroups[0].headers.map((e) => {
      if (e.Header === filterValue) {
        e.toggleSortBy();
      }
    });
  };

  const clickOpen = (contractAddress: string, index: number) => {
    setIsOpen(contractAddress);
    setTimeout(() => {
      focusTarget.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const renderBtn = (contractAddress: string, index: number) => {
    if (isOpen === contractAddress)
      return (
        <TriangleDownIcon
          _hover={{cursor: 'pointer'}}
          onClick={() => setIsOpen('')}
        />
      );
    return (
      <TriangleUpIcon
        _hover={{cursor: 'pointer'}}
        onClick={() => clickOpen(contractAddress, index)}></TriangleUpIcon>
    );
  };

  return (
    <Flex w="1100px" flexDir={'column'}>
      <Flex justifyContent={'space-between'} mb={'23px'}>
        <Flex>
          {getStatus('sale', colorMode)}
          {getStatus('start', colorMode)}
          {getStatus('end', colorMode)}
        </Flex>
        <Select
          w={'137px'}
          h={'32px'}
          color={'#86929d'}
          fontSize={'13px'}
          placeholder="On sale Sort"
          onChange={onChangeSelectBox}>
          <option value="name">Name</option>
          <option value="period">Period</option>
          <option value="total staked">Total staked</option>
          <option value="Earning Per Block">Earning per block</option>
        </Select>
      </Flex>
      <Box overflowX={'auto'}>
        <chakra.table
          width={'full'}
          variant="simple"
          {...getTableProps()}
          display="flex"
          flexDirection="column">
          {/* <chakra.thead textAlign={'justify'}>
            {console.log(headerGroups)}
            {headerGroups.map((headerGroup) => (
              <chakra.tr h={16} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <chakra.th
                    px={3}
                    py={3}
                    {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                  </chakra.th>
                ))}
              </chakra.tr>
            ))}
          </chakra.thead> */}
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column">
            {page.map((row: any, i) => {
              const {contractAddress} = row.original;
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
                  borderRadius={'10px'}
                  borderBottomRadius={row.isExpanded === true ? '0px' : '10px'}
                  mb={'20px'}
                  w="100%"
                  bg={colorMode === 'light' ? 'white.100' : 'black.200'}
                  border={colorMode === 'dark' ? '1px solid #373737' : ''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}>
                  {row.cells.map((cell: any, index: number) => {
                    const {token, status, name, period, stakeBalanceTON} =
                      cell.row.original;
                    const type = cell.column.id;
                    const tokenType = checkTokenType(token);
                    return (
                      <chakra.td
                        px={3}
                        py={3}
                        key={index}
                        m={0}
                        mr={30}
                        w={
                          type === 'name'
                            ? '280px'
                            : type === 'period'
                            ? '150px'
                            : type === 'stakeBalanceTON'
                            ? '200px'
                            : type === 'earning_per_block'
                            ? '340px'
                            : '14px'
                        }
                        display="flex"
                        alignItems="center"
                        color={getTextColor(type, colorMode)}
                        fontSize={type === 'name' ? '15px' : '13px'}
                        fontWeight={type === 'name' ? 600 : 0}
                        {...cell.getCellProps()}>
                        {type === 'name' ? getCircle(status) : ''}
                        {type === 'name' ? (
                          <>
                            <Avatar
                              src={tokenType.symbol}
                              backgroundColor={tokenType.bg}
                              bg="transparent"
                              color="#c7d1d8"
                              name="T"
                              h="48px"
                              w="48px"
                              ml="10px"
                              mr="12px"
                            />
                            <Text>{name}</Text>
                          </>
                        ) : (
                          ''
                        )}
                        {type === 'period' ? (
                          <>
                            <Text
                              mr={2}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Period
                            </Text>
                            <Text>{period}</Text>
                          </>
                        ) : (
                          ''
                        )}
                        {type === 'stakeBalanceTON' ? (
                          <>
                            <Text
                              mr={2}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Total Staked
                            </Text>
                            <Text>{stakeBalanceTON}</Text>
                          </>
                        ) : (
                          ''
                        )}

                        {type === 'earning_per_block' ? (
                          <Text
                            mr={2}
                            color={
                              colorMode === 'light' ? '#86929d' : '#949494'
                            }>
                            Earning Per Block
                          </Text>
                        ) : (
                          ''
                        )}
                        {type === 'expander'
                          ? renderBtn(contractAddress, i)
                          : null}
                        {/* {isLoading ? <Skeleton h={5} /> : cell.render('Cell')} */}
                      </chakra.td>
                    );
                  })}
                </chakra.tr>,
                // If the row is in an expanded state, render a row with a
                // column that fills the entire length of the table.
                isOpen === contractAddress ? (
                  <chakra.tr
                    boxShadow="0 1px 1px 0 rgba(96, 97, 112, 0.16)"
                    w={'100%'}
                    h={500}
                    key={i}
                    m={0}
                    mb={'14px'}
                    mt={-5}
                    bg={colorMode === 'light' ? 'white.100' : ''}
                    border={colorMode === 'light' ? '' : 'solid 1px #373737'}
                    borderTopWidth={0}
                    borderBottomRadius="10px">
                    <chakra.td
                      display={'flex'}
                      w={'100%'}
                      margin={0}
                      colSpan={visibleColumns.length}>
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
                isDisabled={!canPreviousPage}
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
          </Flex>

          <Flex>
            <Tooltip label="Next Page">
              <IconButton
                aria-label={'Next Page'}
                onClick={nextPage}
                size={'sm'}
                isDisabled={!canNextPage}
                icon={<ChevronRightIcon h={6} w={6} />}
                ml={4}
              />
            </Tooltip>
            <Select
              w={28}
              size={'sm'}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
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
    </Flex>
  );
};

// @todo (isaac): add mobile table
// const MobileTable = () => {
//   return;
// };
