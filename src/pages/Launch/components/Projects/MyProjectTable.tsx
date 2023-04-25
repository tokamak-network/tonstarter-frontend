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
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {selectTransactionType} from 'store/refetch.reducer';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {Link, useRouteMatch} from 'react-router-dom';
import {FC, useEffect, useRef} from 'react';
import {LoadingComponent} from 'components/Loading';
import moment from 'moment';
import {selectLaunch, setMode} from '@Launch/launch.reducer';

import {
  Column,
  useExpanded,
  usePagination,
  useTable,
  useSortBy,
} from 'react-table';
import {number} from 'prop-types';
import saveToAdmin from '@Launch/utils/saveToAdmin';
import {Contract} from '@ethersproject/contracts';
import {getSigner} from 'utils/contract';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {DEPLOYED, BASE_PROVIDER, OPENSEA} from 'constants/index';
import * as ProjectTokenABI from 'services/abis/ProjectToken.json';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';

const {ProjectTokenProxy} = DEPLOYED;
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
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const dispatch: any = useAppDispatch();

  const theme = useTheme();
  const {account, library, chainId} = useActiveWeb3React();
  const focusTarget = useRef<any>([]);
  const ProjectToken = new Contract(
    ProjectTokenProxy,
    ProjectTokenABI.abi,
    library,
    );
    
  useEffect(() => {
    async function getNFTInfo() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }

      const tokensOfOwner = await ProjectToken.tokensOfOwner(account);
      const uris = await Promise.all(
        tokensOfOwner.map(async (token: any) => {
          const uriObj = await ProjectToken.tokenURIValue(token);
          return {...token, uriObj};
        }),
      );
    }
    getNFTInfo();
  }, [transactionType, blockNumber, projects, data]);

  const mintNFT = async (project: any) => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const div = document.createElement('div');
    div.innerHTML = project.description;
    const tokenURI = {
      name: project.projectName,
      description: div.textContent,
      external_url: project.website,
      image: project.tokenSymbolImage,
      attributes: project.vaults.map((vault: any) => {
        return {
          trait_type: vault.vaultName,
          value: vault.vaultAddress,
        };
      }),
    };
    const stringURI = JSON.stringify(tokenURI);
    const signer = getSigner(library, account);
    try {
      const receipt = await ProjectToken.connect(signer).mint(`${stringURI}`);
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
      }
    } catch (e) {
      store.dispatch(setTxPending({tx: false}));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx fail to send',
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        }),
      );
    }
  };

  //data.length === 0
  if (!account || account === undefined || account === null ) {
    return (
      <Flex
        justifyContent={'center'}
        alignItems={'center'}
        h={'100px'}
        fontFamily={theme.fonts.roboto}
        fontSize={'16px'}>
        <Text>Please connect with Metamask</Text>
      </Flex>
    );
  }
 else if (isLoading === true) {
    return (
      <Flex
        w="1102px"
        position={'absolute'}
        justifyContent={'center'}
        alignItems={'center'}>
        <LoadingComponent></LoadingComponent>
      </Flex>
    );
  } else if (data.length === 0) {
    return (
      <Flex
        justifyContent={'center'}
        alignItems={'center'}
        h={'100px'}
        fontFamily={theme.fonts.roboto}
        fontSize={'16px'}>
        <Text>There are no owned projects</Text>
      </Flex>
    );
  }
  return (
    <Flex w="1102px" flexDir={'column'}>
      <Flex>
        {[
          'Name',
          'Token Name',
          'Token Symbol',
          'Token Supply',
          'Sale Period',
          'Status',
          'Action',
        ].map((title: string, index:number) => {
          return (
            <Text
            key={index}
              borderTop={colorMode === 'dark' ? '1px solid #373737' : ''}
              borderLeft={
                title === 'Name'
                  ? colorMode === 'dark'
                    ? '1px solid #373737'
                    : ''
                  : ''
              }
              borderRight={
                title === 'Action'
                  ? colorMode === 'dark'
                    ? '1px solid #373737'
                    : ''
                  : ''
              }
              borderTopLeftRadius={title === 'Name' ? '10px' : ''}
              borderTopRightRadius={title === 'Action' ? '10px' : ''}
              textAlign={'center'}
              lineHeight={'45px'}
              fontSize={'12px'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.fld}
              h={'45px'}
              color={colorMode === 'light' ? '#3a495f' : 'white.100'}
              bg={colorMode === 'light' ? 'white.100' : 'black.200'}
              w={
                title === 'Name'
                  ? '137px'
                  : title === 'Token Name'
                  ? '113px'
                  : title === 'Token Symbol'
                  ? '118px'
                  : title === 'Token Supply'
                  ? '130px'
                  : title === 'Sale Period'
                  ? '150px'
                  : title === 'Status'
                  ? '140px'
                  : title === 'Action'
                  ? '314px'
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
                      project,
                      listed,
                      tokenID,
                    } = cell.row.original;
                    const type = cell.column.id;
                    
                    
                    // {/* TODO: Change this check value to isSimplified later */}
                    const simplified = project?.isSimplified === true;  
                    // const marketCap = project?.marketCap;
                    return (
                      <chakra.td
                        key={index}
                        m={0}
                        wordBreak={'break-word'}
                        w={
                          type === 'name'
                            ? '137px'
                            : type === 'tokenName'
                            ? '113px'
                            : type === 'tokenSymbol'
                            ? '118px'
                            : type === 'totalSupply'
                            ? '130px'
                            : type === 'saleDate'
                            ? '150px'
                            : type === 'status'
                            ? '140px'
                            : type === 'action'
                            ? '314px'
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
                        {type === 'name' &&
                          (status === true ? (
                            <Link to={`${url}/project/${name}`}>
                              <Text _hover={{textDecor: 'underline'}}>
                                {name}
                              </Text>{' '}
                            </Link>
                          ) : (
                            <Text>{name}</Text>
                          ))}
                        {type === 'tokenName' && tokenName}
                        {type === 'tokenSymbol' && tokenSymbol}
                        {type === 'totalSupply' && totalSupply}
                        {type === 'saleDate' &&
                          `${
                            saleDate[0] !== 0
                              ? moment
                                  .unix(saleDate[0])
                                  .format('YYYY.MM.DD')
                                  .concat('~')
                                  .concat(
                                    moment
                                      .unix(saleDate[1])
                                      .format('YYYY.MM.DD'),
                                  )
                              : '-'
                          } `}
                        {type === 'status' &&
                          (status === true
                            ? listed === true
                              ? 'Listed on Tonstarter'
                              : 'Deployed'
                            : 'Not Deployed')}
                        {type === 'action' && (
                          <Flex
                            w={'312px'}
                            justifyContent={'center'}
                            gap={'10px'}>
                              {/* TODO: Change this check value to isSimplified later */}
                            { simplified ?
                            (<Link to={`${url}/${key}/`}>
                              <Button
                                fontWeight={'normal'}
                                w={'90px'}
                                h={'40px'}
                                mx={'5px'}
                                bg={'transparent'}
                                color={'#2a72e5'}
                                fontSize={'12px'}
                                border={'solid 1px #2a72e5'}
                                _hover={{bg: 'transparent'}}
                                _active={{bg: 'transparent'}} 
                                
                                onClick={() => {
                                  dispatch(
                                    setMode({
                                      data: 'simplified',
                                    }),
                                  );
                                }}>
                                Edit
                              </Button>
                            </Link>) : 
                            (<Link to={`${url}/${key}/`}>
                              <Button
                                fontWeight={'normal'}
                                w={'90px'}
                                h={'40px'}
                                mx={'5px'}
                                bg={'transparent'}
                                color={'#2a72e5'}
                                fontSize={'12px'}
                                border={'solid 1px #2a72e5'}
                                _hover={{bg: 'transparent'}}
                                _active={{bg: 'transparent'}}
                                onClick={() => {
                                  dispatch(
                                    setMode({
                                      data: 'advanced',
                                    }),
                                  );
                                }}>
                                Edit
                              </Button>
                            </Link>)}
                            {status === true ? (
                              listed === true ? (
                                tokenID !== null ? (
                                  <a
                                    target={'blank'}
                                    href={`${OPENSEA}${Number(tokenID)}`}>
                                    <Button
                                      w={'90px'}
                                      h={'40px'}
                                      mx={'5px'}
                                      bg={'#257eee'}
                                      borderRadius={'4px'}
                                      color={'#ffffff'}
                                      fontWeight={'normal'}
                                      fontSize={'12px'}
                                      _hover={{bg: '#257eee'}}
                                      _active={{bg: '#257eee'}}
                                      px={'10px'}
                                      whiteSpace={'normal'}
                                      alignItems={'center'}>
                                      See Project NFT
                                    </Button>
                                  </a>
                                ) : (
                                  <Button
                                    w={'90px'}
                                    h={'40px'}
                                    mx={'5px'}
                                    px={'10px'}
                                    whiteSpace={'normal'}
                                    bg={'#257eee'}
                                    color={'#ffffff'}
                                    fontWeight={'normal'}
                                    fontSize={'12px'}
                                    _hover={{bg: '#257eee'}}
                                    _active={{bg: '#257eee'}}
                                    onClick={() => mintNFT(project)}>
                                    Mint Project NFT
                                  </Button>
                                )
                              ) : (
                                <Flex>
                                  {' '}
                                  <Button
                                    w={'90px'}
                                    h={'40px'}
                                    mx={'5px'}
                                    bg={'#257eee'}
                                    color={'#ffffff'}
                                    fontWeight={'normal'}
                                    fontSize={'12px'}
                                    _hover={{bg: '#257eee'}}
                                    _active={{bg: '#257eee'}}
                            
                                    px={'9px'}
                                    whiteSpace={'normal'}
                                    onClick={() => saveToAdmin(project, key)}>
                                    List on TONStarter
                                  </Button>
                                  <Button
                                    w={'90px'}
                                    h={'40px'}
                                    mx={'5px'}
                                    bg={'#257eee'}
                                    px={'10px'}
                                    whiteSpace={'normal'}
                                    color={'#ffffff'}
                                    fontWeight={'normal'}
                                    fontSize={'12px'}
                                    _hover={{bg: '#257eee'}}
                                    _active={{bg: '#257eee'}}
                                    onClick={() => mintNFT(project)}>
                                    Mint Project NFT
                                  </Button>
                                </Flex>
                              )
                            ) : (
                              <></>
                            )}
                          </Flex>
                        )}
                        {/* {type === 'action' &&
                          (status === true ? (
                            listed === true ? (
                              <Flex>
                                <Text
                                  w={'136px'}
                                  h={'25px'}
                                  borderRadius={'4px'}
                                  bg={
                                    colorMode === 'light'
                                      ? '#e9edf1'
                                      : '#353535'
                                  }
                                  justifyContent={'center'}
                                  alignItems={'center'}
                                  pt={'4px'}
                                  mr={'10px'}>
                                  Done
                                </Text>
                                {tokenID !== null ? (
                                  <a
                                    target={'blank'}
                                    href={`${OPENSEA}${Number(tokenID)}`}>
                                    <Button
                                      w={'136px'}
                                      h={'25px'}
                                      bg={'#257eee'}
                                      borderRadius={'4px'}
                                      color={'#ffffff'}
                                      fontWeight={'normal'}
                                      fontSize={'12px'}
                                      _hover={{bg: '#257eee'}}
                                      _active={{bg: '#257eee'}}
                                      pt={'4px'}
                                      alignItems={'center'}>
                                      See Project NFT
                                    </Button>
                                  </a>
                                ) : (
                                  <Button
                                    w={'136px'}
                                    h={'25px'}
                                    bg={'#257eee'}
                                    color={'#ffffff'}
                                    fontWeight={'normal'}
                                    fontSize={'12px'}
                                    _hover={{bg: '#257eee'}}
                                    _active={{bg: '#257eee'}}
                                    onClick={() => mintNFT(project)}>
                                    Mint Project NFT
                                  </Button>
                                )}
                              </Flex>
                            ) : (
                              <Flex>
                                {' '}
                                <Button
                                  w={'136px'}
                                  h={'25px'}
                                  bg={'#257eee'}
                                  color={'#ffffff'}
                                  fontWeight={'normal'}
                                  fontSize={'12px'}
                                  _hover={{bg: '#257eee'}}
                                  _active={{bg: '#257eee'}}
                                  mr={'10px'}
                                  onClick={() => saveToAdmin(project, key)}>
                                  List on TONStarter
                                </Button>
                                <Button
                                  w={'136px'}
                                  h={'25px'}
                                  bg={'#257eee'}
                                  color={'#ffffff'}
                                  fontWeight={'normal'}
                                  fontSize={'12px'}
                                  _hover={{bg: '#257eee'}}
                                  _active={{bg: '#257eee'}}
                                  onClick={() => mintNFT(project)}>
                                  Mint Project NFT
                                </Button>
                              </Flex>
                            )
                          ) : (
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
                          ))} */}
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
