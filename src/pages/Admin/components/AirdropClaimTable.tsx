import {FC, useRef} from 'react';
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
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {LoadingComponent} from 'components/Loading';
import {CustomButton} from 'components/Basic/CustomButton';
import {useDispatch} from 'react-redux';
import {openModal} from 'store/modal.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useModal} from 'hooks/useModal';
import AdminActions from '../actions';
import {FetchPoolData} from '@Admin/types';

// type ListTableProps = {
//   columns: Column[];
//   data: FetchPoolData[];
//   isLoading: boolean;
// };

export const AirdropClaimTable = ({columns, data, isLoading}) => {
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
  const dispatch = useDispatch();
  const {chainId} = useActiveWeb3React();
  const {handleOpenConfirmModal} = useModal();
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
        {['Name', 'Address', 'Number of reward programs', 'Actions'].map(
          (title: string) => {
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
                  title === 'Name'
                    ? '200px'
                    : title === 'Address'
                    ? '454px'
                    : title === 'Number of reward programs'
                    ? '220px'
                    : '226px'
                }
                borderBottom={
                  colorMode === 'light'
                    ? '1px solid #f4f6f8'
                    : '1px solid #323232'
                }>
                {title}
              </Text>
            );
          },
        )}
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
            {page.map((row: any, i: number) => {
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
                  borderBottomRadius={
                    (i + 1) % 10 === 0 || page.length === i + 1 ? '10px' : ''
                  }
                  // mb={'20px'}
                  w="100%"
                  bg={colorMode === 'light' ? 'white.100' : 'black.200'}
                  border={colorMode === 'dark' ? '1px solid #373737' : ''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}>
                  {row.cells.map((cell: any, index: number) => {
                    const {
                      poolName: name,
                      poolAddress: address,
                      numRewardPrograms: rewardPrograms,
                    } = cell.row.original;
                    const type = cell.column.id;
                    return (
                      <chakra.td
                        key={index}
                        m={0}
                        w={
                          type === 'name'
                            ? '200px'
                            : type === 'address'
                            ? '454px'
                            : type === 'rewardPrograms'
                            ? '220px'
                            : '226px'
                        }
                        h={'55px'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize={'12px'}
                        fontWeight={500}
                        p={0}
                        textAlign="center"
                        {...cell.getCellProps()}>
                        {type === 'name' && name}
                        {type === 'address' && address}
                        {type === 'rewardPrograms' && rewardPrograms}
                        {type === 'action' && (
                          <Flex
                            w={'100%'}
                            justifyContent="space-between"
                            px={'30px'}
                            py={'15px'}>
                            <CustomButton
                              text={'Edit'}
                              w={'78px'}
                              h={'25px'}
                              fontSize={12}
                              func={() =>
                                dispatch(
                                  openModal({
                                    type: 'Admin_EditPool',
                                    data: {
                                      originalData: cell.row.original,
                                    },
                                  }),
                                )
                              }></CustomButton>
                            <CustomButton
                              text={'Delete'}
                              w={'78px'}
                              h={'25px'}
                              fontSize={12}
                              style={{
                                border: 'solid 1px #2a72e5',
                                background: '#ffffff',
                                color: '#2a72e5',
                              }}
                              func={() =>
                                chainId &&
                                handleOpenConfirmModal({
                                  type: 'confirm',
                                  data: {
                                    from: 'admin/poolDelete',
                                    amount: {name, address},
                                    action: () =>
                                      AdminActions.deletePool({
                                        poolAddress: address,
                                      }),
                                  },
                                })
                              }></CustomButton>
                          </Flex>
                        )}
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
