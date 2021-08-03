import React, {FC, useState, useRef, useMemo} from 'react';
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
  useColorMode,
  Center,
  useTheme,
  Grid,
  Button,
  position,
  Link,
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {openModal, closeModal, ModalType} from 'store/modal.reducer';
import {useEffect, useCallback} from 'react';
import { getPoolName } from '../../utils/token';
import {selectTableType} from 'store/table.reducer';
import {LoadingComponent} from 'components/Loading';
import { chakra } from '@chakra-ui/react';
import {IconClose} from 'components/Icons/IconClose';
import {IconOpen} from 'components/Icons/IconOpen';
import store from '../../store';
import { approve } from './actions';
import { convertNumber } from '../../utils/number';
import {selectTransactionType} from 'store/refetch.reducer';
import { BooleanValueNode } from 'graphql';
import { fetchPositionRangePayload } from './utils/fetchPositionRangePayload';

type PositionTableProps = {
  // columns: Column[];
  positions: any[];
  positionData: any[];
  stakingDisable: boolean;
  // isLoading: boolean;
  // address: string;
}

type LiquidityPositionProps = {
  stakingDisable: boolean;
  owner: string;
  lpData: any;
  poolName: string;
  id: string;
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

const getCircle = (type: 'staked' | 'not staked') => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={0} ml={'16px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={
          type === 'staked'
            ? '#73d500'
            : '#f95359'
        }></Box>
    </Flex>
  );
};

const getRange = (type: 'range' | 'not range') => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={0} ml={'4px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={
          type === 'range'
            ? '#2ea2f8'
            : '#ff7800'
        }></Box>
    </Flex>
  );
};

const getStatus = (
  type: 'staked' | 'not staked',
  colorMode: 'light' | 'dark',
) => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={'20px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={
          type === 'staked' ? '#73d500' : '#f95359'
        }
        mr={'7px'}
         />
      <Text
        fontSize={'11px'}
        color={colorMode === 'light' ? '#304156' : 'white.100'}>
        {type === 'staked' ? 'Staked' : 'Not Staked'}
      </Text>
    </Flex>
  );
};

const getRangeStatus = (
  type: 'range' | 'not range',
  colorMode: 'light' | 'dark',
) => {
  return (
    <Flex alignContent={'center'} alignItems={'center'} mr={'20px'}>
      <Box
        w={'8px'}
        h={'8px'}
        borderRadius={50}
        bg={
          type === 'range' ? '#2ea2f8' : '#ff7800'
        }
        mr={'7px'}
         />
      <Text
        fontSize={'11px'}
        color={colorMode === 'light' ? '#304156' : 'white.100'}>
        {type === 'range' ? 'In range' : 'Out of range'}
      </Text>
    </Flex>
  );
};

export const PositionTable: FC<PositionTableProps> = ({
  positions,
  positionData,
  stakingDisable,
  // isLoading,
  // address,
}) => {
  const columns = useMemo(
    () => [
      {
        Header: 'name',
        accessor: 'name',
      },
      {
        Header: 'Liquidity',
        accessor: 'liquidity',
      },
      {
        Header: 'Staking',
        accessor: 'staking',
      },
      {
        Header: 'Unstaking',
        accessor: 'unstaking',
      },
      {
        Header: 'Claim',
        accessor: 'claim',
      },
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({row}: {row: any}) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <IconClose /> : <IconOpen />}
          </span>
        ),
      },
    ],
    [],
  );

  const {address, library} = store.getState().user.data;

  const {
    getTableBodyProps,
    headerGroups,
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
    {columns, data: positions, initialState: {pageIndex: 0}},
    useSortBy,
    useExpanded,
    usePagination,
  );
  const dispatch = useAppDispatch();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const focusTarget = useRef<any>([]);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);

  const {
    data: {contractAddress, index},
  } = useAppSelector(selectTableType);

  const onChangeSelectBox = (e: any) => {
    const filterValue = e.target.value;
    headerGroups[0].headers.map((e) => {
      // if (e.Header === filterValue) {
      //   if (e.Header === 'staked') {
      //     return e.toggleSortBy();
      //   }
      //   e.toggleSortBy(true);
      // }
      return null;
    });
  };
  const LiquidityPosition : FC<LiquidityPositionProps>= ({
    owner,
    stakingDisable,
    poolName,
    lpData,
    id,
  }) => {
    const {colorMode} = useColorMode();
    const [stakingBtnDisable, setStakingBtnDisable] = useState(true);
    const [claimBtnDisable, setClaimBtnDisable] = useState(true);
    const btnStyle = {
      btn: () => ({
        bg: 'blue.500',
        color: 'white.100',
        borderRadius: '4px',
        w: '105px',
        h: '38px',
        py: '10px',
        px: '29.5px',
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontWeight: '500',
        _hover: {backgroundColor: 'white.200'},
      }),
    }
    const [range, setRange] = useState(false);

    const rangePayload = async (args: any) => {
      const {address, library, id} = args;
      const result = await fetchPositionRangePayload(library, id, address);

      return result;
    }
    useEffect(() => {
      async function getRange() {
        if (id && address && library) {
          const result = await rangePayload({library, id, address});
          // const { tick, tickLower, tickUpper } = result
          // console.log(Number(result?.tick) > Number(result.tickLower))
          // console.log(result)
          // (Number(result.tick) > Number(result.tickLower) && Number(result.tick) < Number(result.tickUpper)) ? setRange(true) : setRange(false)
        }
      }
      getRange()
    }, [])

    console.log(range)
    useEffect(() => {
      function setStakingBtn () {
        if (owner === address.toLowerCase() || stakingDisable) {
          setStakingBtnDisable(false)
        } else {
          setStakingBtnDisable(true)
        }
      }
      
      function setClaimBtn () {
        if (owner !== address.toLowerCase() && lpData) {
          if (lpData.miningAmount.toString() !== '0') {
            setClaimBtnDisable(false)
          }
        }
      }
      setStakingBtn()
      setClaimBtn()
    }, [position, stakingDisable, transactionType, blockNumber])

    return (
      <Flex>
        {owner === address.toLowerCase() ? getCircle('not staked') : getCircle('staked')}
        {getRange('range')}
        <Flex
          ml={'32px'}
          w={'170px'}
          py={2}
        >
          <Text>{poolName}</Text>
          <Text fontSize={'14px'} pt={1}>
            _#{id}
          </Text>    
        </Flex>
        <Flex
          alignContent={'center'}
          fontWeight={300}
          fontSize={'12px'}
          direction={'row'}
          w={'180px'}
          py={3}
        >
          <Text color={'#2a72e5'} mr={1}>TOS Earned </Text>
          { lpData ?
          <Text>{convertNumber({
            amount: lpData.miningAmount.toString()
          })} TOS</Text> : 
          <Text>0.00 TOS</Text>}
        </Flex>
        <Grid pos="relative" templateColumns={'repeat(5, 1fr)'} gap={3} mr={'40px'}>
          <Button 
            {...btnStyle.btn()}
            disabled={claimBtnDisable}
            onClick={() => dispatch(openModal({ type:'claimPool', data: id}))}
          >
            Claim
          </Button>
          <Button 
           {...btnStyle.btn()}
            disabled={owner !== address.toLowerCase()}
            onClick={() => approve({
              tokenId: id,
              userAddress: address,
              library: library,
            })}
          >
            Approve
          </Button>
          <Button 
            {...btnStyle.btn()}
            disabled={stakingBtnDisable}
            onClick={() => dispatch(openModal({ type:'stakePool', data: id}))}
          >
            Staking
          </Button>
          <Button 
            {...btnStyle.btn()}
            disabled={owner === address.toLowerCase()}
            onClick={() => dispatch(openModal({ type:'unstakePool', data: id}))}
          >
            Unstaking
          </Button>
          <Button 
            {...btnStyle.btn()}
            bg={'#00c3c4'}
            onClick={() => window.location.href=`https://app.uniswap.org/#/pool/${id}`}
          >
            Edit
          </Button>
        </Grid>
      </Flex>
    )
  }
    
  return (
    <Flex w="1100px" flexDir={'column'}>
      <Box overflowX={'auto'}>
        <chakra.table
          width={'full'}
          variant="simple"
          display="flex"
          flexDirection="column"
        >
          <chakra.tbody
            {...getTableBodyProps()}
            display="flex"
            flexDirection="column"
          >
            <chakra.tr
              h={'80px'}
              pb={'3px'}
              bg={colorMode === 'light' ? 'white.100' : ''}
              border={colorMode === 'light' ? '' : 'solid 1px #373737'}
              borderBottom={'1px'}
              borderBottomColor={'#f4f6f8'}
              borderTopWidth={0} 
            >
              <chakra.td
                display={'flex'}
                justifyContent={'space-between'}
                px={12}
                pl={16}
                py={5}
                w={'100%'}
                margin={0}
                colSpan={visibleColumns.length}
              >
                <Flex>
                  {getStatus('staked', colorMode)}
                  {getStatus('not staked', colorMode)}
                  <Text fontSize={'11px'} py={2} mr={3}>/</Text>
                  {getRangeStatus('range', colorMode)}
                  {getRangeStatus('not range', colorMode)}
                </Flex>
                <Select
                  w={'137px'}
                  h={'32px'}
                  color={'#86929d'}
                  fontSize={'13px'}
                  placeholder="On sale Sort"
                  onChange={onChangeSelectBox}>
                </Select>
              </chakra.td>
            </chakra.tr>
            {page.map((row: any, i) => {
              const {id, pool, owner} = row.original;  
              const poolName = getPoolName(pool.token0.symbol, pool.token1.symbol)
              const lpData = positionData.find((data) => data.positionid.toString() === id)
              return [
                <chakra.tr 
                  w={'100%'}
                  key={i}
                  // mt={2}
                  h={'80px'}
                  pb={'3px'}
                  bg={colorMode === 'light' ? 'white.100' : ''}
                  border={colorMode === 'light' ? '' : 'solid 1px #373737'}
                  borderBottom={'1px'}
                  borderBottomColor={'#f4f6f8'}
                  borderTopWidth={0} 
                >
                  <chakra.td
                    display={'flex'}
                    w={'100%'}
                    pl={12}
                    py={5}
                    key={index}
                    colSpan={visibleColumns.length}
                    fontSize={'17px'}
                    fontWeight={600}
                  >
                    <LiquidityPosition 
                      poolName={poolName}
                      owner={owner}
                      lpData={lpData}
                      stakingDisable={stakingDisable}
                      id={id}
                    />
                  </chakra.td>
              </chakra.tr>
            ]
          })}
            <chakra.tr
              w={'100%'}
              h={'80px'}
              // mt={-5}
              pt={'5px'}
              pr={9}
              bg={colorMode === 'light' ? 'white.100' : ''}
              border={colorMode === 'light' ? '' : 'solid 1px #373737'}
              borderBottom={'1px'}
              borderBottomColor={'#f4f6f8'}
              borderTopWidth={0}   
              borderBottomRadius="10px"
            >
              <chakra.td
                display={'flex'}
                w={'100%'}
                margin={0}
                justifyContent="flex-end"
                
                colSpan={visibleColumns.length}
              >
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
                      <Text fontWeight="bold" as="span" color={'blue.300'}>
                        {pageIndex + 1}
                      </Text>{' '}
                    </Text>
                  </Flex>
                  <Flex mr={'300px'}>
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
                  </Flex>
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
              </chakra.td>
            </chakra.tr>
          </chakra.tbody>
        </chakra.table>
      </Box>
    </Flex>
  )
}