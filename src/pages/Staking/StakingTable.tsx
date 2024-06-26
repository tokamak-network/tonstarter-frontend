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
  useColorMode,
  Center,
  useTheme,
  Image,
  Button,
} from '@chakra-ui/react';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import './staking.css';
// import {checkTokenType} from 'utils/token';
import {TriangleUpIcon, TriangleDownIcon} from '@chakra-ui/icons';
import {selectTableType} from 'store/table.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useEffect} from 'react';
import {setTimeout} from 'timers';
import {LoadingComponent} from 'components/Loading';
// import {fetchStakeURL} from 'constants/index';
// import {selectTransactionType} from 'store/refetch.reducer';
import {
  checkCanWithdrawLayr2All,
  stakeTonControl,
} from './actions/stakeTONControl';
import {
  // isUnstakeL2All,
  requestUnstakingLayer2All,
  isAblePowerTONSwap,
} from './actions';
import {useBlockNumber} from 'hooks/useBlock';
import {CustomTooltip} from 'components/Tooltip';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {TokenImage} from '@Admin/components/TokenImage';
import TON_SYMBOL from 'assets/tokens/TON_symbol_nobg.svg';
import {openModal} from 'store/modal.reducer';
import commafy from 'utils/commafy';

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

const GetL2Status = ({
  sort,
  mr,
  onlyImage,
}: {
  sort: 'canUnstake' | 'canWithdraw' | 'canSwap';
  mr?: string;
  onlyImage?: boolean;
}) => {
  const {colorMode} = useColorMode();

  return (
    <Flex alignItems="center" mr={mr}>
      <Flex
        w={'16px'}
        h={'16px'}
        bg={
          sort === 'canUnstake'
            ? 'blue.500'
            : sort === 'canWithdraw'
            ? 'green.100'
            : 'orange.100'
        }
        mr={'7px'}
        alignItems="center"
        justifyContent="center"
        color="white.100"
        fontSize={12}>
        {sort === 'canUnstake' && 'U'}
        {sort === 'canWithdraw' && 'W'}
        {sort === 'canSwap' && 'S'}
      </Flex>
      <Text
        fontSize={11}
        color={colorMode === 'light' ? 'black.300' : 'white.100'}>
        {sort === 'canUnstake' && onlyImage === false && 'Unstake from layer2'}
        {sort === 'canWithdraw' && onlyImage === false && 'Withdraw'}
        {sort === 'canSwap' && onlyImage === false && 'Swap'}
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
  const theme = useTheme();
  const focusTarget = useRef<any>([]);
  const {blockNumber} = useBlockNumber();
  const {library} = useActiveWeb3React();

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
            focusTarget?.current[
              index - Math.floor(index / 10) * 10
            ]?.scrollIntoView({
              block: 'start',
            });
          }, 100);
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [isWithdrawAndSwapAll, setIsWithdrawAndSwapAll] =
    useState<boolean>(false);
  const [isUnstakeAll, setIsUnstakeAll] = useState<boolean>(false);
  const [isPowerTONSwap, setIsPowerTONSwap] = useState<boolean>(false);

  //withdraw&swapall btn able condition
  useEffect(() => {
    async function callIsWithdrawAndSwapAll() {
      if (library) {
        const isWithdraw = await checkCanWithdrawLayr2All(library);
        // const isUnstakeAll = await isUnstakeL2All(library);
        const isPowerTONSwap = await isAblePowerTONSwap(library);

        const isUnstakeAll = data.filter(
          (data) => data.L2status.canUnstake === true,
        );

        setIsWithdrawAndSwapAll(isWithdraw || false);
        setIsUnstakeAll(isUnstakeAll.length > 0);
        setIsPowerTONSwap(isPowerTONSwap || false);
      }
    }
    callIsWithdrawAndSwapAll();
  }, [blockNumber, library, data]);

  //refetch to update Total Staked, Earninger Per Ton after stake, unstake
  // const {
  //   transactionType,
  //   blockNumber,
  //   data: txData,
  // } = useAppSelector(selectTransactionType);
  // const {actionType, txContractAddress} = txData;

  // useEffect(() => {
  //   async function refetchStake() {
  //     if (
  //       (transactionType === 'Staking' && actionType === 'Stake') ||
  //       actionType === 'Untake'
  //     )
  //       console.log('**refetch**');
  //     console.log(txContractAddress);
  //     const fetchEachStakeURL = `${fetchStakeURL}&stakeContract=${txContractAddress}`;
  //     const res = await fetch(fetchEachStakeURL);
  //     console.log(res);
  //   }
  //   refetchStake();
  // }, [transactionType, blockNumber, txData, actionType, txContractAddress]);

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
    setTimeout(() => {
      focusTarget?.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  const renderBtn = (contractAddress: string, index: number) => {
    if (isOpen === contractAddress)
      return (
        <Flex w={'100%'} justifyContent="flex-end" _hover={{cursor: 'pointer'}}>
          <TriangleUpIcon color="blue.100" _hover={{cursor: 'pointer'}} />
        </Flex>
      );
    return (
      <Flex
        w={'100%'}
        justifyContent="flex-end"
        // onClick={() => clickOpen(contractAddress, index)}
        _hover={{cursor: 'pointer'}}>
        <TriangleDownIcon
          color="blue.100"
          _hover={{cursor: 'pointer'}}></TriangleDownIcon>
      </Flex>
    );
  };

  const dispatch = useAppDispatch();

  if (isLoading === true || data.length === 0) {
    return (
      <Center>
        <LoadingComponent />
      </Center>
    );
  }

  const {btnStyle} = theme;

  return (
    <Flex w="1100px" flexDir={'column'}>
      <Flex justifyContent={'space-between'} mb={'23px'} ml={'17px'}>
        <Flex>
          {getStatus('sale', colorMode)}
          {getStatus('start', colorMode)}
          {getStatus('end', colorMode)}
          <Flex
            color={'#c7d1d8'}
            fontSize={'8px'}
            mr={'20px'}
            alignItems="center">
            <Text>|</Text>
          </Flex>
          <GetL2Status
            sort={'canUnstake'}
            mr={'20px'}
            onlyImage={false}></GetL2Status>
          <GetL2Status
            sort={'canWithdraw'}
            mr={'20px'}
            onlyImage={false}></GetL2Status>
          <GetL2Status sort={'canSwap'} onlyImage={false}></GetL2Status>
        </Flex>
        <Select
          w={'137px'}
          h={'32px'}
          color={'#86929d'}
          fontSize={'13px'}
          onChange={onChangeSelectBox}
          defaultValue={'period'}>
          <option value="period">Period</option>
          <option value="total staked">Total Staked</option>
          <option value="Earning Per TON">Earning Per TON</option>
        </Select>
      </Flex>
      <Box overflowX={'auto'}>
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
                  onClick={() => {
                    if (isOpen === contractAddress) {
                      setIsOpen('');
                    } else {
                      clickOpen(contractAddress, i);
                    }
                  }}
                  cursor={'pointer'}
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
                    const {
                      token,
                      status,
                      name,
                      period,
                      stakeBalanceTON,
                      ept,
                      L2status,
                      saleClosed,
                    } = cell.row.original;
                    const {canSwap, canUnstake, canWithdraw} = L2status;
                    const type = cell.column.id;
                    return (
                      <chakra.td
                        py={3}
                        key={index}
                        m={0}
                        w={
                          type === 'name'
                            ? '362px'
                            : type === 'period'
                            ? '150px'
                            : type === 'stakeBalanceTON'
                            ? '230px'
                            : type === 'earning_per_ton'
                            ? '200px'
                            : '10px'
                        }
                        pr={0}
                        display="flex"
                        alignItems="center"
                        color={getTextColor(type, colorMode)}
                        fontSize={type === 'name' ? '15px' : '13px'}
                        fontWeight={type === 'name' ? 600 : 0}
                        {...cell.getCellProps()}>
                        {type === 'name' ? getCircle(status) : ''}
                        {type === 'name' ? (
                          <>
                            <Box ml={'10px'} mr={'12px'}>
                              <TokenImage imageLink={TON_SYMBOL}></TokenImage>
                            </Box>
                            <Text w={'176px'}>{name}</Text>
                            {/* <Button onClick={()=>openModal({type: 'manage', data: {...data}})}>manage</Button> */}
                            <Flex
                              justifyContent="flex-start"
                              w={'80px'}
                              pl={'13px'}
                              mr={'20px'}>
                              {canUnstake && (
                                <GetL2Status
                                  sort={'canUnstake'}
                                  mr={'1px'}></GetL2Status>
                              )}
                              {canWithdraw && (
                                <GetL2Status
                                  sort={'canWithdraw'}
                                  mr={'1px'}></GetL2Status>
                              )}
                              {canSwap === true && saleClosed === false && (
                                <GetL2Status sort={'canSwap'}></GetL2Status>
                              )}
                            </Flex>
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
                            <Text>{period.split('.')[1]}</Text>
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
                            <Text mr={'4px'}>{commafy(stakeBalanceTON)}</Text>
                            <Text> TON</Text>
                          </>
                        ) : (
                          ''
                        )}

                        {type === 'earning_per_ton' ? (
                          <Flex justifyContent={'space-around'} w={'100%'}>
                            <Text
                              w={'150px'}
                              color={
                                colorMode === 'light' ? '#86929d' : '#949494'
                              }>
                              Earning Per TON
                            </Text>
                            <Text w={120}>
                              {ept === undefined ? null : ept}{' '}
                              {ept === undefined ? null : 'TOS'}{' '}
                            </Text>
                            <Tooltip
                              hasArrow
                              placement="right"
                              label="This estimator could be change depending on the situation"
                              color={theme.colors.white[100]}
                              bg={theme.colors.gray[375]}>
                              <Image src={tooltipIcon} />
                            </Tooltip>
                          </Flex>
                        ) : (
                          ''
                        )}
                        {type === 'expander' ? (
                          <Box ml={'115px'}>
                            {renderBtn(contractAddress, i)}
                          </Box>
                        ) : null}
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
                    h={'375px'}
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
        {/* PAGENATION FOR LATER */}
        <Flex justifyContent="flex-end" my={4} alignItems="center">
          <Flex w={'100%'} r={'100%'}>
            {/* <CustomTooltip
              toolTipW={245}
              toolTipH={'50px'}
              fontSize="12px"
              msg={[
                'You can withdraw&swap #1~#4 seig TON',
                'thorough this function',
              ]}
              placement={'top'}
              component={
                <Button
                  {...(isWithdrawAndSwapAll
                    ? {...btnStyle.btnAble()}
                    : {...btnStyle.btnDisable({colorMode})})}
                  w={'140.53px'}
                  isDisabled={!isWithdrawAndSwapAll}
                  fontSize={'14px'}
                  fontWeight={600}
                  onClick={() => stakeTonControl()}>
                  Withdraw & Swap
                </Button>
              }></CustomTooltip> */}
            <Box>
              {/* <CustomTooltip
                toolTipW={245}
                toolTipH={'50px'}
                fontSize="12px"
                msg={[
                  'You can unstake #1~#3 seig TON',
                  'thorough this function',
                ]}
                placement={'top'}
                component={
                  <Button
                    {...(isUnstakeAll
                      ? {...btnStyle.btnAble()}
                      : {...btnStyle.btnDisable({colorMode})})}
                    w={'140.53px'}
                    isDisabled={!isUnstakeAll}
                    fontSize={'14px'}
                    fontWeight={600}
                    onClick={() => requestUnstakingLayer2All()}>
                    Unstake
                  </Button>
                }
                ></CustomTooltip> */}
            </Box>
            {/* <Box ml={'10px'}>
              <CustomTooltip
                toolTipW={245}
                toolTipH={'50px'}
                fontSize="12px"
                msg={[
                  'You can swap Power TON to TOS',
                  'thorough this function',
                ]}
                placement={'top'}
                component={
                  <Button
                    {...(isPowerTONSwap
                      ? {...btnStyle.btnAble()}
                      : {...btnStyle.btnDisable({colorMode})})}
                    w={'140.53px'}
                    isDisabled={!isPowerTONSwap}
                    fontSize={'14px'}
                    fontWeight={600}
                    onClick={() =>
                      dispatch(openModal({type: 'powerTonSwap', data: {}}))
                    }>
                    Power TON Swap
                  </Button>
                }></CustomTooltip>
            </Box> */}
          </Flex>
          {data.length > 10 && (
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
          )}

          {data.length > 10 && (
            <Flex
              alignItems="center"
              p={0}
              fontSize={'13px'}
              fontFamily={theme.fonts.roboto}
              color={colorMode === 'light' ? '#3a495f' : '#949494'}
              pb={'3px'}>
              Page{' '}
              <Text fontWeight="bold" as="span" color={'blue.300'}>
                {pageIndex + 1}
              </Text>{' '}
              of{' '}
              <Text fontWeight="bold" as="span">
                {pageOptions.length}
              </Text>
            </Flex>
          )}

          {data.length > 10 && (
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
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

// @todo (isaac): add mobile table
// const MobileTable = () => {
//   return;
// };
