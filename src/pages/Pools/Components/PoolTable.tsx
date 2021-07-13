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
  Text,
  Flex,
  IconButton,
  Tooltip,
  Select,
  Box,
  Avatar,
  useColorMode,
  Center,
  useTheme,
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import '../pool.css';
import {checkTokenType} from 'utils/token';
import {TriangleUpIcon, TriangleDownIcon} from '@chakra-ui/icons';
import {selectTableType} from 'store/table.reducer';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect} from 'react';
import {setTimeout} from 'timers';
import {LoadingComponent} from 'components/Loading';
import {useWindowDimensions} from 'hooks/useWindowDimentions';

type TableProps = {
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

export const PoolTable: FC<TableProps> = ({
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
  const theme = useTheme();
  const focusTarget = useRef<any>([]);

  const {
    data: {contractAddress, index},
  } = useAppSelector(selectTableType);

  useEffect(() => {
    if (index) {
      let loop = Math.floor(index / 10);
      while (loop) {
        nextPage();
        loop = loop - 1;
        if (loop === 0) {
          setTimeout(() => {
            focusTarget.current[
              index - Math.floor(index / 10) * 10
            ].scrollIntoView({
              block: 'start',
            });
          }, 200);
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [isOpen, setIsOpen] = useState(
    contractAddress === undefined ? '' : contractAddress,
  );
  const onChangeSelectBox = (e: any) => {
    const filterValue = e.target.value;
    headerGroups[0].headers.map((e) => {
      if (e.Header === filterValue) {
        e.toggleSortBy();
      }
      return null;
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
        <TriangleUpIcon
          _hover={{cursor: 'pointer'}}
          onClick={() => setIsOpen('')}
        />
      );
    return (
      <TriangleDownIcon
        _hover={{cursor: 'pointer'}}
        onClick={() => clickOpen(contractAddress, index)}></TriangleDownIcon>
    );
  };

  const {height} = useWindowDimensions();

  if (isLoading === true || data.length === 0) {
    return (
      <Center h={height - 363}>
        <LoadingComponent />
      </Center>
    );
  }

  return (
    <Flex w="1100px" flexDir={'column'}>
      <Flex justifyContent={'space-between'} mb={'23px'}>
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
                  borderBottomRadius={
                    isOpen === contractAddress ? '0px' : '10px'
                  }
                  borderBottom={isOpen === contractAddress ? '1px' : ''}
                  borderBottomColor={
                    isOpen === contractAddress ? '#f4f6f8' : ''
                  }
                  mb={'20px'}
                  w="100%"
                  bg={colorMode === 'light' ? 'white.100' : 'black.200'}
                  border={colorMode === 'dark' ? '1px solid #373737' : ''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}>
                  {row.cells.map((cell: any, index: number) => {
                    const {token, liquidity, name, volume, fees} =
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
                        {type === 'liquidity' ? (
                          <>
                            <Text
                              mr={2}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Liquidity
                            </Text>
                            <Text>{liquidity}</Text>
                          </>
                        ) : (
                          ''
                        )}
                        {type === 'volume' ? (
                          <>
                            <Text
                              mr={2}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Volume(24hrs)
                            </Text>
                            <Text>{volume}</Text>
                          </>
                        ) : (
                          ''
                        )}

                        {type === 'fees' ? (
                          <>
                            <Text
                              mr={2}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Fees(24hrs)
                            </Text>
                            <Text>{fees}</Text>
                          </>
                        ) : (
                          ''
                        )}
                        {type === 'expander'
                          ? renderBtn(contractAddress, i)
                          : null}
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
                    h={'413px'}
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
                      {renderDetail({
                        row,
                      })}
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
            <Tooltip label="Previous Page">
              <IconButton
                w={'24px'}
                h={'24px'}
                bg={colorMode === 'light' ? 'white.100' : 'none'}
                border={
                  colorMode === 'light'
                    ? 'solid 1px #e6eaee'
                    : 'solid 1px #424242'
                }
                color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                borderRadius={4}
                aria-label={'Previous Page'}
                onClick={previousPage}
                isDisabled={!canPreviousPage}
                size={'sm'}
                mr={4}
                _hover={{borderColor: '#2a72e5', color: '#2a72e5'}}
                icon={<ChevronLeftIcon h={6} w={6} />}
              />
            </Tooltip>
          </Flex>

          <Flex
            alignItems="center"
            p={0}
            fontSize={'13px'}
            fontFamily={theme.fonts.roboto}
            color={colorMode === 'light' ? '#3a495f' : '#949494'}
            pb={'3px'}>
            <Text flexShrink={0}>
              Page{' '}
              <Text fontWeight="bold" as="span" color={'blue.300'}>
                {pageIndex + 1}
              </Text>{' '}
              of{' '}
              <Text fontWeight="bold" as="span">
                {pageOptions.length}
              </Text>
            </Text>
          </Flex>

          <Flex>
            <Tooltip label="Next Page">
              <Center>
                <IconButton
                  w={'24px'}
                  h={'24px'}
                  border={
                    colorMode === 'light'
                      ? 'solid 1px #e6eaee'
                      : 'solid 1px #424242'
                  }
                  color={colorMode === 'light' ? '#e6eaee' : '#424242'}
                  bg={colorMode === 'light' ? 'white.100' : 'none'}
                  borderRadius={4}
                  aria-label={'Next Page'}
                  onClick={nextPage}
                  isDisabled={!canNextPage}
                  size={'sm'}
                  ml={4}
                  mr={'1.5625em'}
                  _hover={{borderColor: '#2a72e5', color: '#2a72e5'}}
                  icon={<ChevronRightIcon h={6} w={6} />}
                />
              </Center>
            </Tooltip>
            <Select
              w={'117px'}
              h={'32px'}
              color={colorMode === 'light' ? ' #3e495c' : '#f3f4f1'}
              bg={colorMode === 'light' ? 'white.100' : 'none'}
              boxShadow={
                colorMode === 'light'
                  ? '0 1px 1px 0 rgba(96, 97, 112, 0.14)'
                  : ''
              }
              border={colorMode === 'light' ? '' : 'solid 1px #424242'}
              borderRadius={4}
              size={'sm'}
              value={pageSize}
              fontFamily={theme.fonts.roboto}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};
