import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Container,
  Select,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {FC, useState, useEffect} from 'react';
import {fetchPositionRangePayload} from '../utils/fetchPositionRangePayloads';
import {utils, ethers} from 'ethers';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {orderBy} from 'lodash';
type LPTokenComponentProps = {
  tokens: any[];
};

type Token = {
  id: string;
  owner: string;
  pool: object;
};
const themeDesign = {
  border: {
    light: 'solid 1px #e7edf3',
    dark: 'solid 1px #535353',
  },
  font: {
    light: 'black.300',
    dark: 'gray.475',
  },
  tosFont: {
    light: 'gray.250',
    dark: 'black.100',
  },
  borderDashed: {
    light: 'dashed 1px #dfe4ee',
    dark: 'dashed 1px #535353',
  },
  buttonColorActive: {
    light: 'gray.225',
    dark: 'gray.0',
  },
  buttonColorInactive: {
    light: '#c9d1d8',
    dark: '#777777',
  },
};

export const LPTokenComponent: FC<LPTokenComponentProps> = ({tokens}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [allTokens, setAllTokens] = useState<any[]>([]);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(6);
  const {account: address, library} = useActiveWeb3React();
useEffect (() => {

  const closed = tokens.filter((token: any) =>getStatus(token) === 'closed')
  const open = tokens.filter((token: any) =>getStatus(token) === 'open')
  const openOrdered = orderBy(open, (data) =>Number(data.id), ['desc']);
  const closeOrdered = orderBy(closed, (data) =>Number(data.id), ['desc']);
  const tokenList = openOrdered.concat(closeOrdered);
  setAllTokens(tokenList);  
  
},[tokens, address, library])

  useEffect(() => {
    const pagenumber = parseInt(
      ((tokens.length - 1) / pageLimit + 1).toString(),
    );
    setPageOptions(pagenumber);
  }, [tokens]);

  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return allTokens.slice(startIndex, endIndex);
  };

  const goToNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  const gotToPreviousPage = () => {
    setPageIndex(pageIndex - 1);
  };

  const changePage = (pageNumber: number) => {
    setPageIndex(pageNumber);
    getPaginationGroup();
  };
  const getPaginationGroup = () => {
    let start = Math.floor((pageIndex - 1) / 5) * 5;

    const group = new Array(5).fill(1).map((_, idx) => start + idx + 1);
    return group;
  };

  const getStatus = (token: any) => {
    const liquidity = Number(
      ethers.utils.formatEther(token.liquidity.toString()),
    );
    if (liquidity > 0 ) {
      return 'open';
    }  else {
      return 'closed';
    }
  };
  return (
    <Box>
      <Flex w={'100%'} borderBottom={themeDesign.border[colorMode]}>
        <Text
          fontFamily={theme.fonts.titil}
          px={'15px'}
          mt="30px"
          fontSize="20px"
          color={colorMode === 'light' ? 'gray.250' : 'white.100'}
          fontWeight="bold"
          pb={'10px'}>
          My LP Tokens
        </Text>
      </Flex>
      <Flex
        flexWrap={'wrap'}
        flexDirection={'column'}
        px={'20px'}
        pt={'15px'}
        h={'81px'}
        alignItems={'center'}>
        {getPaginatedData().length === 0 ? (
          <Text fontSize={'13px'}>
            You don't have any LP tokens in this pool
          </Text>
        ) : (
          <Grid templateColumns="repeat(3, 1fr)" gap={'10px'}>
            {getPaginatedData().map((token: any, index) => {
             const status = getStatus(token);             
              return (
                <Flex
                  key={index}
                  h="30px"
                  px={'10px'}
                  cursor={'pointer'}
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={'bold'}
                  borderRadius="19px"
                  justifyContent={'center'}
                  alignItems={'center'}
                  border={themeDesign.border[colorMode]}
                 
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(`https://app.uniswap.org/#/pool/${token.id}`);
                  }}>
                  <Text  textDecoration={status === 'closed' ?'line-through' : 'none'} color={'blue.500'}>#{token.id}</Text>
                </Flex>
              );
            })}
          </Grid>
        )}
      </Flex>
      <Flex
        flexDirection={'row'}
        pb="30px"
        justifyContent={'center'}
        pt="19px"
        mx="15px">
        <Flex>
          <Tooltip label="Previous Page">
            <IconButton
              minW={'24px'}
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
              onClick={gotToPreviousPage}
              isDisabled={pageIndex === 1}
              size={'sm'}
              mr={4}
              _active={{background: 'transparent'}}
              _hover={{
                borderColor: colorMode === 'light' ? '#3e495c' : '#2a72e5',
                color: colorMode === 'light' ? '#3e495c' : '#2a72e5',
              }}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>
        <Flex>
          {getPaginationGroup().map((groupIndex: number, index: number) => {
            const data = getPaginatedData().length;
            return (
              <Button
                h="24px"
                key={index}
                minW="24px"
                background="transparent"
                fontFamily={theme.fonts.roboto}
                fontSize="13px"
                fontWeight="normal"
                color={
                  pageIndex === groupIndex
                    ? themeDesign.buttonColorActive[colorMode]
                    : themeDesign.buttonColorInactive[colorMode]
                }
                p="0px"
                _hover={{
                  background: 'transparent',
                  color: themeDesign.buttonColorActive[colorMode],
                }}
                _active={{background: 'transparent'}}
                disabled={pageOptions < groupIndex}
                onClick={() => changePage(groupIndex)}>
                {groupIndex}
              </Button>
            );
          })}
        </Flex>
        <Flex>
          <Tooltip label="Next Page">
            <IconButton
              minW={'24px'}
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
              onClick={goToNextPage}
              isDisabled={pageIndex === pageOptions}
              size={'sm'}
              ml={4}
              mr={'1.5625em'}
              _active={{background: 'transparent'}}
              _hover={{
                borderColor: colorMode === 'light' ? '#3e495c' : '#2a72e5',
                color: colorMode === 'light' ? '#3e495c' : '#2a72e5',
              }}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};
