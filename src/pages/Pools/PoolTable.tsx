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
  IconButton,
  Tooltip,
  Select,
  Box,
  Avatar,
  useColorMode,
  Center,
  useTheme,
  Image,
} from '@chakra-ui/react';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {TriangleUpIcon, TriangleDownIcon} from '@chakra-ui/icons';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect} from 'react';
import {setTimeout} from 'timers';
import {selectTableType} from 'store/table.reducer';
import {LoadingComponent} from 'components/Loading';
import { chakra } from '@chakra-ui/react';
import { getPoolName, checkTokenType } from '../../utils/token';
import { convertNumber } from '../../utils/number';

type PoolTableProps = {
  columns: Column[];
  data: any[];
  // renderDetail: Function;
  isLoading: boolean;
}

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

export const PoolTable: FC<PoolTableProps> = ({
  columns,
  data,
  // renderDetail,
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

  // useEffect(() => {
  //   if (index) {
  //     let loop = Math.floor(index / 10);
  //     while (loop) {
  //       nextPage();
  //       loop = loop - 1;
  //       if (loop === 0) {
  //         setTimeout(() => {
  //           focusTarget.current[
  //             index - Math.floor(index / 10) * 10
  //           ].scrollIntoView({
  //             block: 'start',
  //           });
  //         }, 200);
  //       }
  //     }
  //   }
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [isOpen, setIsOpen] = useState(
    contractAddress === undefined ? '' : contractAddress,
  );

  // const goPrevPage = () => {
  //   setIsOpen('');
  //   previousPage();
  // };

  // const goNextPage = () => {
  //   setIsOpen('');
  //   nextPage();
  // };

  const onChangeSelectBox = (e: any) => {
    const filterValue = e.target.value;
    headerGroups[0].headers.map((e) => {
      if (e.Header === filterValue) {
        if (e.Header === 'Earning Per TON') {
          return e.toggleSortBy();
        }
        e.toggleSortBy(true);
      }
      return null;
    });
  };
  const clickOpen = (contractAddress: string, index: number) => {
    setIsOpen(contractAddress);
  };

  const renderBtn = (contractAddress: string, index: number) => {
    if (isOpen === contractAddress)
      return (
        <Flex w={'100%'} justifyContent="flex-end" _hover={{cursor: 'pointer'}}>
          <Text
            mr="14px"
            fontFamily="roboto"
            h="18px"
            fontWeight="bold"
          >
            Choose LP
          </Text>
          <TriangleUpIcon color="blue.100" _hover={{cursor: 'pointer'}} />
        </Flex>
      );
    return (
      <Flex
        w={'100%'}
        justifyContent="flex-end"
        onClick={() => clickOpen(contractAddress, index)}
        _hover={{cursor: 'pointer'}}>
        <Text
          mr="14px"
          fontFamily="roboto"
          h="18px"
          fontWeight="bold"
        >
          Choose LP
        </Text>
        <TriangleDownIcon
          color="blue.100"
          _hover={{cursor: 'pointer'}}></TriangleDownIcon>
      </Flex>
    );
  };

  if (isLoading === true || data.length === 0) {
    return (
      <Center>
        <LoadingComponent />
      </Center>
    );
  }

  return (
    <Flex w="1100px" flexDir={'column'}>
      <Flex justifyContent={'flex-end'} mb={'23px'}>
        <Select
            w={'137px'}
            h={'32px'}
            color={'#86929d'}
            fontSize={'13px'}
            placeholder="On sale Sort"
            onChange={onChangeSelectBox}>
            <option value="name">Name</option>
            <option value="pliquidity">Liquidity</option>
            <option value="volume">Volume</option>
            <option value="fee">Fees</option>
        </Select>
      </Flex>
      <Box overflowX={'auto'}>
        <chakra.table
          width={'full'}
          variant="simple"
          {...getTableProps()}
          display="flex"
          flexDirection="column"
        >
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
                    if (isOpen === id) {
                      setIsOpen('');
                    } else {
                      clickOpen(id, i);
                    }
                  }}
                  cursor={'pointer'}
                  borderRadius={'10px'}
                  mb={'20px'}
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
                    const poolName = getPoolName(data.token0.symbol, data.token1.symbol);
                    const tokenType = checkTokenType(data.token0.id);
                    return (
                      <chakra.td
                        px={3}
                        py={3}
                        key={index}
                        m={0}
                        w={
                          type === 'name'
                            ? '280px'
                            : type === 'liquidity'
                            ? '200px'
                            : type === 'volume'
                            ? '200px'
                            : type === 'fee'
                            ? ''
                            : '280px'
                        }
                        display="flex"
                        alignItems="center"
                        color={getTextColor(type, colorMode)}
                        fontSize={type === 'name' ? '15px' : '13px'}
                        fontWeight={type === 'name' ? 600 : 0}
                        {...cell.getCellProps()}
                      >
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
                            ml="34px"
                            mr="12px"
                          />
                          <Text>{poolName}</Text>
                        </>
                        ) : (
                          ''
                        )} {type === 'liquidity' ? (
                          <>
                            <Text
                              mr={3}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Liquidity
                            </Text>
                            <Text>$ {
                              convertNumber({
                                amount: data.liquidity,
                                type: 'ray'
                              })
                            }
                            </Text>
                          </>
                        ) : (
                          ''
                        )}
                        {type === 'volume' ? (
                          <>
                            <Text
                              mr={3}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Volume(24hrs)
                            </Text>
                            <Text>$ {data.poolDayData[0].volumeUSD}</Text>
                          </>
                        ) : (
                          ''
                        )}

                        {type === 'fee' ? (
                          <>
                            <Text
                              mr={2}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Fees(24hrs)
                            </Text>
                            <Text>$ {data.poolDayData[0].feesUSD}</Text>
                          </>
                        ) : (
                          ''
                        )}
                        {type === 'expander'
                          ? renderBtn(data.id, i)
                          : null}
                      </chakra.td>
                    )
                  })}
                </chakra.tr>
              ];
            })}
          </chakra.tbody>
        </chakra.table>
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
                // onClick={goPrevPage}
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
              {/* <IconButton
                aria-label={'Next Page'}
                onClick={nextPage}
                size={'sm'}
                isDisabled={!canNextPage}
                icon={<ChevronRightIcon h={6} w={6} />}
                ml={4}
                mr={'1.5625em'}
              /> */}
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
                  // onClick={goNextPage}
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
              mr={1}
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
  )
}