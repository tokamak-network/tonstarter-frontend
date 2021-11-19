import {FC, useState, useMemo, useEffect, useRef} from 'react';
import {
  Text,
  Grid,
  Flex,
  Select,
  Box,
  IconButton,
  Tooltip,
  Button,
  useColorMode,
  useTheme,
  Center,
} from '@chakra-ui/react';
import {useAppSelector} from 'hooks/useRedux';
import {getPoolName} from '../../utils/token';
import {ClaimReward} from './components/ClaimReward';
import {RewardProgramCard} from './components/RewardProgramCard';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {stakeMultiple} from './actions';
import {useActiveWeb3React} from 'hooks/useWeb3';

import {
  chakra,
  // useTheme
} from '@chakra-ui/react';
import {number} from 'prop-types';
type Pool = {
  id: string;
  liquidity: string;
  poolDayData: [];
  tick: string;
  token0: Token;
  token1: Token;
};
type Token = {
  id: string;
  symbol: string;
};
type RewardContainerProps = {
  rewards: any[];
  position?: string;
  selectedPool?: Pool;
  pools: any[]
};
type Reward = {
  chainId: Number;
  poolName: String;
  token1Address: string;
  token2Address: string;
  poolAddress: String;
  rewardToken: String;
  incentiveKey: Object;
  startTime: Number;
  endTime: Number;
  allocatedReward: String;
  numStakers: Number;
  status: String;
};
const multipleStakeList: any = [];
export const RewardContainer: FC<RewardContainerProps> = ({
  rewards,
  selectedPool,
  position,
  pools
}) => {
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(6);
  const {account, library} = useActiveWeb3React();
  const [stakeList, setStakeList] = useState([]);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  useEffect(() => {
    const pagenumber = parseInt(
      ((rewards.length - 1) / pageLimit + 1).toString(),
    );
    setPageOptions(pagenumber);
  }, [rewards, pageLimit, selectedPool]);

  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return rewards.slice(startIndex, endIndex);
  };

  const goToNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  const gotToPreviousPage = () => {
    setPageIndex(pageIndex - 1);
  };

  const stakeMultipleKeys = (key: any) => {
    if (
      multipleStakeList.filter(
        (listkey: any) =>
        JSON.stringify(listkey) === JSON.stringify(key)
      ).length > 0
    ) {
      multipleStakeList.pop(key);
    } else {
      multipleStakeList.push(key);
    }
    return multipleStakeList;
  };

  return (
    <Flex justifyContent={'space-between'} mb="100px">
      <Flex flexWrap={'wrap'}>
        <Grid templateColumns="repeat(2, 1fr)" gap={30}>
          {getPaginatedData().map((reward: any, index) => {
            let token0;
            let token1;

            const includedPool = pools.filter((pool) => pool.id === reward.poolAddress);
              token0 = includedPool[0].token0.id;
              token1 = includedPool[0].token1.id;
           

            const rewardProps = {
              chainId: reward.chainId,
              poolName: reward.poolName,
              token0Address: token0,
              token1Address: token1,
              poolAddress: reward.poolAddress,
              rewardToken: reward.rewardToken,
              incentiveKey: reward.incentiveKey,
              startTime: reward.startTime,
              endTime: reward.endTime,
              allocatedReward: reward.allocatedReward,
              numStakers: reward.numStakers,
              status: reward.status,
            };
            return (
              <RewardProgramCard
                key={index}
                reward={rewardProps}
                selectedToken={Number(position)}
                selectedPool={selectedPool?selectedPool.id:''}
                sendKey={stakeMultipleKeys}
                pageIndex={pageIndex}
                stakeList={multipleStakeList}
              />
            );
          })}
        </Grid>
        <Flex
          mt={'22px'}
          position={'relative'}
          flexDir={'row'}
          width={'95%'}
          justifyContent={'space-between'}>
          <Button
            w={'120px'}
            h={'33px'}
            bg={'blue.500'}
            color="white.100"
            ml={'10px'}
            fontFamily={theme.fonts.roboto}
            fontSize="14px"
            fontWeight="500"
            disabled={position === ''}
            _hover={{backgroundColor: 'none'}}
            _disabled={
              colorMode === 'light'
                ? {
                    backgroundColor: 'gray.25',
                    cursor: 'default',
                    color: '#86929d',
                  }
                : {
                    backgroundColor: '#353535',
                    cursor: 'default',
                    color: '#838383',
                  }
            }
            onClick={() =>
              stakeMultiple({
                userAddress: account,
                tokenid: Number(position),
                library: library,
                stakeKeyList: multipleStakeList,
              })
            }>
           Stake Multiple
          </Button>
          <Flex flexDirection={'row'} h={'25px'} alignItems={'center'}>
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
              color={colorMode === 'light' ? '#3a495f' : '#949494'}>
              <Text flexShrink={0}>
                Page{' '}
                <Text fontWeight="bold" as="span" color={'blue.300'}>
                  {pageIndex}
                </Text>{' '}
                of{' '}
                <Text fontWeight="bold" as="span">
                  {pageOptions}
                </Text>
              </Text>
            </Flex>
            <Flex>
              <Tooltip label="Next Page">
                <Center>
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
                value={pageLimit}
                fontFamily={theme.fonts.roboto}
                onChange={(e) => {
                  setPageLimit(Number(e.target.value));
                }}>
                {[2, 4, 6, 8, 10, 12].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </Select>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex>{/* <ClaimReward /> */}</Flex>
    </Flex>
  );
};
