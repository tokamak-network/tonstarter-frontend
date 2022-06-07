import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Avatar,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';

import {FC, useState, useEffect} from 'react';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {checkLowerCaseTokenType} from '../../../utils/token';
import moment from 'moment';
import {ethers} from 'ethers';
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
  },
};
type PoolComponentProps = {
  pools: any[];
  rewards: any[];
  tokens: any[];
};

export const PoolComponent: FC<PoolComponentProps> = ({
  pools,
  rewards,
  tokens,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  // const {account, library} = useActiveWeb3React();
  // const [allPools, setAllPools] = useState<any[]>([]);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(2);

  useEffect(() => {
    const pagenumber = parseInt(
      ((pools.length - 1) / pageLimit + 1).toString(),
    );
    setPageOptions(pagenumber);
  }, [pageLimit, pools]);

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
      {getPaginatedData().map((pool: any, index: number) => {
        // const length = pool.hourData.length - 1;

        const now = moment().unix();
        const numRewards = rewards.filter(
          (reward) =>
            ethers.utils.getAddress(reward.poolAddress) ===
            ethers.utils.getAddress(pool.pool_address),
        );
        const open = numRewards.filter(
          (reward) => reward.startTime < now && reward.endTime > now,
        ).length;
        const waiting = numRewards.filter(
          (reward) => reward.startTime > now,
        ).length;
        const ended = numRewards.filter(
          (reward) => reward.endTime < now,
        ).length;
        const liquidity = pool.total;
        const token0 = tokens.find(
          (token) =>
            ethers.utils.getAddress(pool.token0Address) ===
            ethers.utils.getAddress(token.tokenAddress),
        );
        const token1 = tokens.find(
          (token) =>
            ethers.utils.getAddress(pool.token1Address) ===
            ethers.utils.getAddress(token.tokenAddress),
        );
        const token0Image = checkLowerCaseTokenType(pool.token0Address);
        const token1Image = checkLowerCaseTokenType(pool.token1Address);
        const tok0Image = token0.tokenImage;
        const tok1Image = token1.tokenImage;
        return (
          <Flex
            key={index}
            h={'73px'}
            borderBottom={themeDesign.border[colorMode]}
            flexDirection={'row'}
            alignItems={'center'}
            px={'10px'}>
            <Box>
              <Avatar
                src={tok0Image}
                bg={token0Image.bg}
                color="#c7d1d8"
                name="T"
                border={
                  colorMode === 'light'
                    ? '1px solid #e7edf3'
                    : '1px solid #3c3c3c'
                }
                h="26px"
                p={token0Image.name === 'ETH' ? '6px' : '0px'}
                w="26px"
               
              />
              <Avatar
                src={tok1Image}
                bg={token1Image.bg}
                color="#c7d1d8"
                name="T"
                h="26px"
                w="26px"
                p={token1Image.name === 'ETH' ? '6px' : '0px'}
                ml={'-7px'}
                zIndex={'100'}
                border={
                  colorMode === 'light'
                    ? '1px solid #e7edf3'
                    : '1px solid #3c3c3c'
                }
              />
            </Box>
            <Text
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              fontWeight={700}
              w={'85px'}
              ml={'5px'}
              cursor={'pointer'}
              fontFamily={theme.fonts.fld}
              fontSize={'16px'}
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `https://info.uniswap.org/#/pools/${pool.pool_address}`,
                );
              }}>
              {pool.pool_name}
            </Text>
            <Box
              fontFamily={theme.fonts.fld}
              fontWeight={700}
              width={'calc(100% - 140px)'}>
              <Text
                fontWeight={700}
                fontSize="11px"
                textAlign={'right'}
                color={colorMode === 'light' ? 'gray.400' : 'gray.150'}>
                Liquidity
              </Text>
              {liquidity !== 0 ? (
                <Text fontSize={'18px'} textAlign={'right'}>
                  {' '}
                  ${' '}
                  {liquidity.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </Text>
              ) : (
                <Text fontSize={'11px'}>No current liquidity data</Text>
              )}
              <Flex justifyContent={'flex-start'} width={'135px'}>
                <Text
                  fontSize="10px"
                  color={colorMode === 'light' ? 'gray.400' : 'gray.150'}>
                  Active
                </Text>
                <Text fontSize="10px" color={'#0070ed'} ml={'2px'}>
                  {open}
                </Text>
                <Text
                  fontSize="10px"
                  color={colorMode === 'light' ? 'gray.400' : 'gray.150'}
                  ml={'2px'}>
                  / Waiting
                </Text>
                <Text fontSize="10px" color={'#0070ed'} ml={'2px'}>
                  {waiting}
                </Text>
                <Text
                  fontSize="10px"
                  color={colorMode === 'light' ? 'gray.400' : 'gray.150'}
                  ml={'2px'}>
                  / Ended
                </Text>
                <Text fontSize="10px" color={'#0070ed'} ml={'2px'}>
                  {ended}
                </Text>
              </Flex>
            </Box>
          </Flex>
        );
      })}
      {getPaginatedData().length === 1 ? (
        <Flex
          h={'73px'}
          borderBottom={themeDesign.border[colorMode]}
          flexDirection={'row'}
          justifyContent={'space-between'}
          alignItems={'center'}
          px={'15px'}></Flex>
      ) : null}
      <Flex
        flexDirection={'row'}
        pb="30px"
        justifyContent={'center'}
        pt="19px"
        mx="15px"
        borderBottom={themeDesign.borderDashed[colorMode]}>
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
                key={index}
                h="24px"
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
