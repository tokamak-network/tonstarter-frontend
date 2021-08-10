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
} from '@chakra-ui/react';
// import tooltipIcon from 'assets/svgs/input_question_icon.svg';
// import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {TriangleUpIcon, TriangleDownIcon} from '@chakra-ui/icons';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect} from 'react';
// import {setTimeout} from 'timers';
import {selectTableType} from 'store/table.reducer';
import {LoadingComponent} from 'components/Loading';
import {chakra} from '@chakra-ui/react';
import {getPoolName, checkTokenType} from '../../utils/token';
import {GET_POSITION, GET_POSITION_BY_ID} from './GraphQL/index';
import {useQuery} from '@apollo/client';
import {PositionTable} from './PositionTable';
import {fetchPositionPayload} from './utils/fetchPositionPayload';
import {selectTransactionType} from 'store/refetch.reducer';
import moment from 'moment';

type PoolTableProps = {
  columns: Column[];
  data: any[];
  isLoading: boolean;
  address: string | undefined;
  library: any;
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

export const PoolTable: FC<PoolTableProps> = ({
  columns,
  data,
  isLoading,
  address,
  library,
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
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const {colorMode} = useColorMode();
  // const theme = useTheme();
  const focusTarget = useRef<any>([]);

  const {
    data: {contractAddress},
  } = useAppSelector(selectTableType);

  const [stakingPosition, setStakingPosition] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [account, setAccount] = useState('');
  const [stakingDisable, setStakingDisable] = useState(true);

  useEffect(() => {
    async function positionPayload() {
      if (address) {
        const result = await fetchPositionPayload(library, address);

        let stringResult: any = [];
        for (let i = 0; i < result?.positionData.length; i++) {
          stringResult.push(result?.positionData[i]?.positionid.toString());
        }
        const nowTime = moment().unix();
        nowTime > Number(result?.saleStartTime.toString()) &&
        nowTime < Number(result?.miningEndTime.toString())
          ? setStakingDisable(false)
          : setStakingDisable(true);

        setPositionData(result?.positionData);
        setStakingPosition(stringResult);
        setAccount(address);
      }
    }
    positionPayload();
  }, [data, transactionType, blockNumber, address, library]);

  const position = useQuery(GET_POSITION, {
    variables: {address: account},
  });

  const positionWithVar = useQuery(GET_POSITION_BY_ID, {
    variables: {id: stakingPosition},
  });

  const [positions, setPositions] = useState([]);
  useEffect(() => {
    function getPosition() {
      if (position.data && positionWithVar.data) {
        position.refetch();

        const withStakedPosition = positionWithVar.data.positions.concat(
          position.data.positions,
        );
        setPositions(withStakedPosition);
      }
    }
    getPosition();
    /*eslint-disable*/
  }, [
    transactionType,
    blockNumber,
    position.loading,
    positionWithVar.loading,
    position.data,
    positionWithVar.data,
    address,
  ]);

  const [isOpen, setIsOpen] = useState(
    contractAddress === undefined ? '' : contractAddress,
  );

  const goPrevPage = () => {
    setIsOpen('');
    previousPage();
  };

  const goNextPage = () => {
    setIsOpen('');
    nextPage();
  };

  const onChangeSelectBox = (e: any) => {
    const filterValue = e.target.value;
    headerGroups[0].headers.map((e) => {
      if (e.Header === filterValue) {
        if (e.Header === 'liquidity') {
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
    if (isOpen === contractAddress || index === 0)
      return (
        <Flex w={'100%'} justifyContent="flex-end" _hover={{cursor: 'pointer'}}>
          <Text mr="14px" fontFamily="roboto" h="18px" fontWeight="bold">
            Choose LP
          </Text>
          <TriangleUpIcon
            mt={'3px'}
            color="blue.100"
            _hover={{cursor: 'pointer'}}
          />
        </Flex>
      );
    return (
      <Flex
        w={'100%'}
        justifyContent="flex-end"
        onClick={() => clickOpen(contractAddress, index)}
        _hover={{cursor: 'pointer'}}>
        <Text mr="14px" fontFamily="roboto" h="18px" fontWeight="bold">
          Choose LP
        </Text>
        <TriangleDownIcon
          mt={'3px'}
          color="blue.100"
          _hover={{cursor: 'pointer'}}
        />
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
      <Flex justifyContent={'flex-end'}>
        <Select
          w={'137px'}
          h={'32px'}
          color={'#86929d'}
          fontSize={'13px'}
          placeholder="On sale Sort"
          onChange={onChangeSelectBox}>
          <option value="name">Name</option>
          <option value="liquidity">Liquidity</option>
          <option value="volume">Volume</option>
          <option value="fee">Fees</option>
        </Select>
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
              const filteredPosition = positions.filter(
                (row: any) => id === row.pool.id,
              );
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
                    if (isOpen === id && filteredPosition.length > 0) {
                      setIsOpen('');
                    } else {
                      clickOpen(id, i);
                    }
                  }}
                  cursor={'pointer'}
                  borderRadius={'10px'}
                  borderBottomRadius={
                    isOpen === id && filteredPosition.length > 0
                      ? '0px'
                      : '10px'
                  }
                  // borderBottom={
                  //   isOpen === id && filteredPosition.length > 0 ? '1px' : ''
                  // }
                  // borderBottomColor={
                  //   isOpen === id && filteredPosition.length > 0
                  //     ? '#f4f6f8'
                  //     : ''
                  // }
                  mt={'20px'}
                  w="100%"
                  bg={colorMode === 'light' ? 'white.100' : 'black.200'}
                  border={colorMode === 'dark' ? '1px solid #373737' : ''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}>
                  {row.cells.map((cell: any, index: number) => {
                    const data = cell.row.original;
                    const type = cell.column.id;
                    const {poolDayData} = data;

                    const length = poolDayData.length - 1;
                    const poolName = getPoolName(
                      data.token0.symbol,
                      data.token1.symbol,
                    );
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
                              ml="34px"
                              mr="12px"
                            />
                            <Text>{poolName}</Text>
                          </>
                        ) : (
                          ''
                        )}{' '}
                        {type === 'liquidity' ? (
                          <>
                            <Text
                              mr={3}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Liquidity
                            </Text>
                            <Text>
                              ${' '}
                              {Number(
                                poolDayData[length].tvlUSD,
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
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
                            <Text>
                              ${' '}
                              {Number(
                                poolDayData[length].volumeUSD,
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </Text>
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
                            <Text>
                              ${' '}
                              {Number(
                                poolDayData[length].feesUSD,
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                              })}
                            </Text>
                          </>
                        ) : (
                          ''
                        )}
                        {type === 'expander'
                          ? renderBtn(data.id, filteredPosition.length)
                          : null}
                      </chakra.td>
                    );
                  })}
                </chakra.tr>,
                isOpen === id && filteredPosition.length > 0 ? (
                  <chakra.tr w={'100%'}>
                    <chakra.td display={'flex'} w={'100%'} margin={0}>
                      <PositionTable
                        positions={filteredPosition}
                        positionData={positionData}
                        stakingDisable={stakingDisable}
                      />
                    </chakra.td>
                  </chakra.tr>
                ) : null,
              ];
            })}
          </chakra.tbody>
        </chakra.table>
        {/* <Flex justifyContent="flex-end" my={4} alignItems="center">
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
                onClick={goPrevPage}
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
                  onClick={goNextPage}
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
          </Flex>
        </Flex> */}
      </Box>
    </Flex>
  );
};
