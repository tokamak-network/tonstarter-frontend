import {FC, useCallback, useEffect, useRef, useState} from 'react';
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
  Select,
  Box,
  useColorMode,
  IconButton,
  Center,
  useTheme,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {LoadingComponent} from 'components/Loading';
import {ListingRewardTableData} from '@Admin/types';
import copyImg from 'assets/svgs/copy-icon.svg';

type ListTableProps = {
  columns: Column[];
  data: any[];
  isLoading: boolean;
};

export const ListRewardTable: FC<ListTableProps> = ({
  columns,
  data,
  isLoading,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    // headerGroups,
    prepareRow,
    // visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    page,
    // nextPage,
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

  const [copyText, setCopyText] = useState<string>('');
  const [oldCopyText, setOldCopyText] = useState<string>('');
  const {onCopy} = useClipboard(copyText as string);

  const handleCopyAction = useCallback(
    (incentiveKeyObj: ListingRewardTableData['incentiveKey']) => {
      setCopyText(JSON.stringify(incentiveKeyObj));
    },
    [],
  );

  useEffect(() => {
    if (copyText !== '' && copyText !== oldCopyText) {
      onCopy();
      setOldCopyText(copyText);
      alert('copied!');
    }
    /*eslint-disable*/
  }, [copyText]);

  if (isLoading === true || data.length === 0) {
    return (
      <Center>
        <LoadingComponent />
      </Center>
    );
  }

  return (
    <Flex w="1100px" flexDir={'column'}>
      <Flex
        borderTopRadius={'10px'}
        boxShadow={
          colorMode === 'light' ? '0 1px 1px 0 rgba(96, 97, 112, 0.16)' : ''
        }>
        {[
          'Pool',
          'Reward Token',
          'IncentiveKey',
          'Start',
          'End',
          'Allocated Reward',
          'Stakers',
          'Status',
        ].map((title: string) => {
          return (
            <Text
              border={colorMode === 'dark' ? '1px solid #373737' : ''}
              borderTopLeftRadius={title === 'Name' ? '10px' : ''}
              borderTopRightRadius={title === 'Actions' ? '10px' : ''}
              textAlign={'center'}
              lineHeight={'45px'}
              fontSize={'12px'}
              fontWeight={'bold'}
              h={'45px'}
              bg={colorMode === 'light' ? 'white.100' : 'black.200'}
              w={
                title === 'Pool'
                  ? '120px'
                  : title === 'Reward Token'
                  ? '87px'
                  : title === 'IncentiveKey'
                  ? '383px'
                  : title === 'Start'
                  ? '95px'
                  : title === 'End'
                  ? '95px'
                  : title === 'Allocated Reward'
                  ? '120px'
                  : title === 'Stakers'
                  ? '90px'
                  : '110px'
              }
              borderBottom={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #323232'
              }>
              {title}
            </Text>
          );
        })}
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
              prepareRow(row);
              return [
                <chakra.tr
                  boxShadow={
                    colorMode === 'light'
                      ? '0 1px 1px 0 rgba(96, 97, 112, 0.16)'
                      : ''
                  }
                  ref={(el) => (focusTarget.current[i] = el)}
                  h={'111px'}
                  key={`reward_table_${i}`}
                  borderBottomRadius={page.length - 1 !== i ? '' : '10px'}
                  //   mb={'20px'}
                  w="100%"
                  bg={colorMode === 'light' ? 'white.100' : 'black.200'}
                  border={colorMode === 'dark' ? '1px solid #373737' : ''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}>
                  {row.cells.map((cell: any, index: number) => {
                    const {
                      pool,
                      rewardToken,
                      incentiveKey,
                      start,
                      end,
                      allocatedReward,
                      stakers,
                      status,
                    } = cell.row.original;
                    const type = cell.column.id;
                    return (
                      <chakra.td
                        key={index}
                        m={0}
                        wordBreak={'break-word'}
                        w={
                          type === 'pool'
                            ? '120px'
                            : type === 'rewardToken'
                            ? '87px'
                            : type === 'incentiveKey'
                            ? '383px'
                            : type === 'start'
                            ? '95px'
                            : type === 'end'
                            ? '95px'
                            : type === 'allocatedReward'
                            ? '120px'
                            : type === 'stakers'
                            ? '90px'
                            : '110px'
                        }
                        h={'111px'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize={12}
                        fontWeight={500}
                        p={0}
                        textAlign="center"
                        {...cell.getCellProps()}>
                        {type === 'pool' && pool}
                        {type === 'rewardToken' && rewardToken}
                        {/* {type === 'incentiveKey' &&
                          JSON.stringify(incentiveKey, null, ' ')} */}
                        {type === 'incentiveKey' && (
                          <Flex
                            flexDir="column"
                            fontSize={10}
                            textAlign="left"
                            lineHeight={1.3}
                            pos={'relative'}>
                            <Text>{'{'}</Text>
                            <Text>
                              rewardToken : {incentiveKey.rewardToken}
                            </Text>
                            <Text>pool : {incentiveKey.pool}</Text>
                            <Text>startTime : {incentiveKey.startTime}</Text>
                            <Text>endTime : {incentiveKey.endTime}</Text>
                            <Text>refundee : {incentiveKey.refundee}</Text>
                            <Text>{'}'}</Text>
                            <img
                              src={copyImg}
                              alt={'copy icon'}
                              style={{
                                position: 'absolute',
                                right: -30,
                                top: '40%',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                handleCopyAction(incentiveKey);
                              }}></img>
                          </Flex>
                        )}
                        {type === 'start' && start}
                        {type === 'end' && end}
                        {type === 'allocatedReward' && allocatedReward}
                        {type === 'stakers' && stakers}
                        {type === 'status' && status}
                      </chakra.td>
                    );
                  })}
                </chakra.tr>,
              ];
            })}
          </chakra.tbody>
        </chakra.table>
        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
        {/* PAGENATION FOR LATER */}
        {data.length > 10 && (
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
              Page{' '}
              <Text fontWeight="bold" as="span" color={'blue.300'}>
                {pageIndex + 1}
              </Text>{' '}
              of{' '}
              <Text fontWeight="bold" as="span">
                {pageOptions.length}
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
                    onClick={previousPage}
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
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
