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
                  onClick={() => {}}
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
                            : '200px'
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
                        {/* {type === 'expander'
                          ? renderBtn(data.id, i)
                          : null} */}
                      </chakra.td>
                    )
                  })}
                </chakra.tr>
              ];
            })}
          </chakra.tbody>
        </chakra.table>
      </Box>
    </Flex>
  )
}