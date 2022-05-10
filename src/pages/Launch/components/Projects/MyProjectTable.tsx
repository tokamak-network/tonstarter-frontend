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
  Button,
} from '@chakra-ui/react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {Link, useRouteMatch} from 'react-router-dom';
import {FC, useRef} from 'react';
// import {useCallback, useEffect, useMemo, useState} from 'react';
// import {PageHeader} from 'components/PageHeader';
// import {useRouteMatch} from 'react-router-dom';
// import {useAppSelector} from 'hooks/useRedux';
// import {selectLaunch} from '@Launch/launch.reducer';
// import {CustomButton} from 'components/Basic/CustomButton';
// import {useDispatch} from 'react-redux';
import moment from 'moment';
import {
  Column,
  useExpanded,
  usePagination,
  useTable,
  useSortBy,
} from 'react-table';
import {number} from 'prop-types';

type MyProjectTableProps = {
  columns: Column[];
  data: any;
  isLoading: boolean;
  projects: any;
};

export const MyProjectTable: FC<MyProjectTableProps> = ({
  columns,
  data,
  isLoading,
  projects,
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
  const match = useRouteMatch();
  const {url} = match;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const focusTarget = useRef<any>([]);
  if (isLoading === true || data.length === 0) {
    return (
      <Flex>
        <Text>Loading</Text>
      </Flex>
    );
  }

  const printProject = (project: any) => {
    console.log(project);
    
  }
  return (
    <Flex w="1102px" flexDir={'column'}>
      <Flex>
        {[
          'Name',
          'Token Name',
          'Token Symbol',
          'Token Supply',
          'Sale Duration',
          'Status',
          'Action',
        ].map((title: string) => {
          return (
            <Text
              borderTop={colorMode === 'dark' ? '1px solid #373737' : ''}
              borderLeft={title === 'Name' ? colorMode === 'dark'?'1px solid #373737' : '':''}
              borderRight={title === 'Action' ? colorMode === 'dark'?'1px solid #373737' : '':''}
              borderTopLeftRadius={title === 'Name' ? '10px' : ''}
              borderTopRightRadius={title === 'Action' ? '10px' : ''}
              textAlign={'center'}
              lineHeight={'45px'}
              fontSize={'12px'}
              fontWeight={'bold'}
              h={'45px'}
              color={colorMode === 'light' ? '#3a495f' : 'white.100'}
              bg={colorMode === 'light' ? 'white.100' : 'black.200'}
              w={
                title === 'Name'
                  ? '150px'
                  : title === 'Token Name'
                  ? '110px'
                  : title === 'Token Symbol'
                  ? '110px'
                  : title === 'Token Supply'
                  ? '150px'
                  : title === 'Sale Duration'
                  ? '190px'
                  : title === 'Status'
                  ? '190px'
                  : title === 'Action'
                  ? '205px'
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
                  h={'55px'}
                  borderBottom={
                    colorMode === 'light'
                      ? '1px solid #f4f6f8'
                      : '1px solid #323232'
                  }
                  key={`project_table_${i}`}
                  borderBottomRadius={page.length - 1 !== i ? '' : '10px'}
                  //   mb={'20px'}
                  w="100%"
                  bg={colorMode === 'light' ? 'white.100' : 'black.200'}
                  borderX={colorMode === 'dark' ? '1px solid #373737' : ''}
                  display="flex"
                  alignItems="center"
                  {...row.getRowProps()}>
                  {row.cells.map((cell: any, index: number) => {                    
                    const {
                      name,
                      tokenName,
                      tokenSymbol,
                      totalSupply,
                      saleDate,
                      status,
                      action,
                      key,
                      project
                    } = cell.row.original;
                    const type = cell.column.id;
                    return (
                      <chakra.td
                        key={index}
                        m={0}
                        wordBreak={'break-word'}
                        w={
                          type === 'name'
                            ? '150px'
                            : type === 'tokenName'
                            ? '110px'
                            : type === 'tokenSymbol'
                            ? '110px'
                            : type === 'totalSupply'
                            ? '150px'
                            : type === 'saleDate'
                            ? '190px'
                            : type === 'status'
                            ? '190px'
                            : type === 'action'
                            ? '200px'
                            : '110px'
                        }
                        h={'55px'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color={colorMode === 'light' ? '#2d3136' : 'white.100'}
                        fontSize={12}
                        fontWeight={500}
                        p={0}
                        textAlign="center"
                        {...cell.getCellProps()}>
                        {type === 'name' && (
                          status === true ? 
                         <Link to={`${url}/project/${name}`}><Text _hover={{textDecor:'underline'}}>{name}</Text> </Link>:  <Text>{name}</Text>
                        )}
                        {type === 'tokenName' && tokenName}
                        {type === 'tokenSymbol' && tokenSymbol}
                        {type === 'totalSupply' &&
                          Number(totalSupply).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                          })}
                        {type === 'saleDate' &&
                          `${moment
                            .unix(saleDate[0])
                            .format('YYYY.MM.DD')} ~ ${moment
                            .unix(saleDate[1])
                            .format('YYYY.MM.DD')}`}
                        {type === 'status' &&
                          (status === true ? 'Deployed' : 'Not Deployed')}
                        {type === 'action' &&
                          (
                            // status === true ? (
                          //   <Button
                          //     w={'136px'}
                          //     h={'25px'}
                          //     bg={'#257eee'}
                          //     color={'#ffffff'}
                          //     fontWeight={'normal'}
                          //     fontSize={'12px'}
                          //     _hover={{bg: '#257eee'}}
                          //     _active={{bg: '#257eee'}}
                          //     onClick={()=> printProject(project)}>
                          //     List on TONStarter
                          //   </Button>
                          // ) :
                           status === true ? (
                            <Link to={`${url}/${key}`}>
                              <Button
                                w={'136px'}
                                fontWeight={'normal'}
                                h={'25px'}
                                bg={'transparent'}
                                color={'#2a72e5'}
                                fontSize={'12px'}
                                border={'solid 1px #2a72e5'}
                                _hover={{bg: 'transparent'}}
                                _active={{bg: 'transparent'}}>
                                Edit
                              </Button>
                            </Link>
                          ) : (
                            <Text
                              w={'136px'}
                              h={'25px'}
                              borderRadius={'4px'}
                              bg={'#e9edf1'}
                              justifyContent={'center'}
                              alignItems={'center'}
                              pt={'4px'}>
                              Done
                            </Text>
                          ))}
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
