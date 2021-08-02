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


type PositionTableProps = {
  // columns: Column[];
  positions: any[];
  positionData: any[];
  // isLoading: boolean;
  // address: string;
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
        mt={'2px'} />
      <Text
        fontSize={'11px'}
        color={colorMode === 'light' ? '#304156' : 'white.100'}>
        {type === 'staked' ? 'Staked' : 'Not Staked'}
      </Text>
    </Flex>
  );
};

export const PositionTable: FC<PositionTableProps> = ({
  positions,
  positionData
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
                    {owner === address.toLowerCase() ? getCircle('not staked') : getCircle('staked')}
                    <Flex
                      ml={'32px'}
                      w={'350px'}
                      py={2}
                    >
                      <Text>{poolName}</Text>
                      <Text fontSize={'14px'} pt={1}>
                        _#{id}
                      </Text>
                      
                    </Flex>
                    <Flex
                      alignContent={'center'}
                    >
                      {lpData? <Text>{lpData.miningAmount.toString()}</Text> : ('')}
                    </Flex>
                    <Grid pos="relative" templateColumns={'repeat(5, 1fr)'} gap={3} mr={'40px'}>
                      <Button 
                        w={'125px'}
                        h={'38px'}
                        py={'10px'}
                        px={'29.5px'}
                        borderRadius={'4px'}
                        bg={'#00c3c4'}
                        fontFamily={'Roboto'}
                        fontSize={'14px'}
                        fontWeight={500}
                        color={'#ffffff'}
                        // onClick={() => ()}
                      >
                        Add Liquidity
                      </Button>
                      <Button 
                        w={'125px'}
                        h={'38px'}
                        py={'10px'}
                        px={'29.5px'}
                        borderRadius={'4px'}
                        bg={'#257eee'}
                        fontFamily={'Roboto'}
                        fontSize={'14px'}
                        fontWeight={500}
                        color={'#ffffff'}
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
                        w={'125px'}
                        h={'38px'}
                        py={'10px'}
                        px={'29.5px'}
                        borderRadius={'4px'}
                        bg={'#257eee'}
                        fontFamily={'Roboto'}
                        fontSize={'14px'}
                        fontWeight={500}
                        color={'#ffffff'}
                        disabled={owner !== address.toLowerCase()}
                        onClick={() => dispatch(openModal({ type:'stakePool', data: id}))}
                      >
                        Staking
                      </Button>
                      <Button 
                        w={'125px'}
                        h={'38px'}
                        py={'10px'}
                        px={'29.5px'}
                        borderRadius={'4px'}
                        bg={'#257eee'}
                        fontFamily={'Roboto'}
                        fontSize={'14px'}
                        fontWeight={500}
                        color={'#ffffff'}
                        disabled={owner === address.toLowerCase()}
                        onClick={() => dispatch(openModal({ type:'unstakePool', data: id}))}
                      >
                        Unstaking
                      </Button>
                      <Button 
                        w={'125px'}
                        h={'38px'}
                        py={'10px'}
                        px={'29.5px'}
                        borderRadius={'4px'}
                        bg={'#257eee'}
                        fontFamily={'Roboto'}
                        fontSize={'14px'}
                        fontWeight={500}
                        color={'#ffffff'}
                        disabled={owner === address.toLowerCase()}
                        onClick={() => dispatch(openModal({ type:'claimPool', data: id}))}
                      >
                        Claim
                      </Button>
                    </Grid>
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