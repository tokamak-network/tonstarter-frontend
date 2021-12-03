import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Container,
  Select,
  Avatar,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';

import {FC, useState, useEffect} from 'react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {checkTokenType} from 'utils/token';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {utils, ethers} from 'ethers';
const themeDesign = {
  border: {
    light: 'solid 1px #d7d9df',
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
  }
};
type PoolComponentProps = {
  pools: any[];
  rewards: any[];
};

export const PoolComponent: FC<PoolComponentProps> = ({pools, rewards}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [allPools, setAllPools] = useState<any[]>([]);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(2);
  const [totalPAges, setTotalPages] = useState<number>(0);
  useEffect(() => {   
    const pagenumber = parseInt(
      ((pools.length - 1) / pageLimit + 1).toString(),
    );
    setPageOptions(pagenumber);
  }, [pools]);

  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return pools.slice(startIndex, endIndex);
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
          Pools
        </Text>
      </Flex>
      {getPaginatedData().map((pool: any, index:number) => {
        const length = pool.poolDayData.length - 1;      
        const numRewards = rewards.filter(
          (reward) => reward.poolAddress === pool.id,
        ).length;
        return (
          <Flex
          key={index}
            h={'73px'}
            borderBottom={themeDesign.border[colorMode]}
            flexDirection={'row'}
            
            alignItems={'center'}
            px={'15px'}>
            <Box>
              <Avatar
                src={pool.token1Image}
                bg={colorMode === 'light' ? '#ffffff' : '#222222'}
                color="#c7d1d8"
                name="T"
                border={
                  colorMode === 'light' ? '1px solid #e7edf3' : '1px solid #3c3c3c'
                }
                h="26px"
                // p={'2px'}
                w="26px"
                zIndex={'100'}
              />
              <Avatar
                src={pool.token0Image}
                bg={colorMode === 'light' ? '#ffffff' : '#222222'}
                color="#c7d1d8"
                name="T"
                h="26px"
                w="26px"
                // p={'2px'}
                ml={'-7px'}
                border={
                  colorMode === 'light' ? '1px solid #e7edf3' : '1px solid #3c3c3c'
                }
              />
            </Box>
            <Text
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              fontWeight={700}
              w={'85px'}
              ml={'7px'}
              fontFamily={theme.fonts.fld}
              fontSize={'17px'}>
              {pool.token0.symbol}+{pool.token1.symbol}
            </Text>
            <Box fontFamily={theme.fonts.fld} fontWeight={700}>
              <Text
                fontWeight={700}
                fontSize="11px"
                color={colorMode === 'light' ? 'gray.400' : 'gray.150'}>
                Liquidity
              </Text>
              {pool.poolDayData[length].tvlUSD === '0'? (<Text fontSize={'11px'}>No current liquidity data</Text>) : (<Text fontSize={'18px'}>
                {' '}
                ${' '}
                {Number(pool.poolDayData[length].tvlUSD).toLocaleString(
                  undefined,
                  {
                    minimumFractionDigits: 2,
                  },
                )}
              </Text>)}

              
              <Text
                fontSize="10px"
                color={colorMode === 'light' ? 'gray.400' : 'gray.150'}>
                {numRewards} Reward Programs
              </Text>
            </Box>
          </Flex>
        );
      })}
      {getPaginatedData().length ===1 ?  <Flex
            h={'73px'}
            borderBottom={themeDesign.border[colorMode]}
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            px={'15px'}></Flex>: null}
      <Flex flexDirection={'row'}  pb='30px' justifyContent={'center'}  pt='19px' mx='15px' borderBottom={themeDesign.borderDashed[colorMode]}>
        <Flex >
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
              _hover={{borderColor: colorMode=== 'light'? '#3e495c' : '#2a72e5', color: colorMode=== 'light'? '#3e495c' : '#2a72e5'}}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>
        <Flex>
          {getPaginationGroup().map((groupIndex: number, index:number) => {
            const data = getPaginatedData().length;
            return (
              <Button
              key={index}
                h="24px"
                minW="24px"
                background="transparent"
                fontFamily={theme.fonts.roboto}
                fontSize='13px'
                fontWeight='normal'
                color={pageIndex===groupIndex? themeDesign.buttonColorActive[colorMode] : themeDesign.buttonColorInactive[colorMode]}
                p='0px'
               _hover={{background: 'transparent', color: themeDesign.buttonColorActive[colorMode] }}
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
              _hover={{borderColor: colorMode=== 'light'? '#3e495c' : '#2a72e5', color: colorMode=== 'light'? '#3e495c' : '#2a72e5'}}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};
