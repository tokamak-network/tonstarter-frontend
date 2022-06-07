import {FC, useState,useEffect} from 'react';
import {
  Text,
  Flex,
  Select,
  Box,
  useColorMode,
  useTheme,
  Grid,
  IconButton,
  Tooltip,
  Button,
  Center,
} from '@chakra-ui/react';
import {selectTransactionType} from 'store/refetch.reducer';
import {useAppSelector, useAppDispatch} from 'hooks/useRedux';
import {getPoolName} from '../../utils/token';
import {CreateReward} from './components/CreateReward';
import {RewardProgramCardManage} from './components/RewardProgramCardManage';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {refundMultiple} from './actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {DEPLOYED} from 'constants/index';
import {ethers} from 'ethers';
import {ConfirmMulticallModal} from './RewardModals';
import {openModal} from 'store/modal.reducer';
import {useBlockNumber} from 'hooks/useBlock';

// import { LPToken } from './types';

type Pool = {
  id: string;
  liquidity: string;
  hourData: [];
  tick: string;
  token0: Token;
  token1: Token;
  token0Image: string;
  token1Image: string;
 
};
type Token = {
  id: string;
  symbol: string;
};
type LPToken = {
  id: string;
  owner: string;
  pool: any;
};
type ManageContainerProps = {
  rewards: any[];
  position?: LPToken;
  selectedPool?: Pool;
  pools: Pool[];
  sortString: string;
  positionsByPool: any;
  LPTokens: any;
  tokens: any[];
};

// let multipleRefundList: any = [];

export const ManageContainer: FC<ManageContainerProps> = ({
  rewards,
  pools,
  position,
  selectedPool,
  sortString,
  positionsByPool,
  LPTokens,
  tokens
}) => {
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(6);
  const [refundNum, setRefundNum] = useState<number>(0);
  const [selectedRewards, setSelectedRewards] = useState<any[]>([]);
  const [multipleRefundList, setMultipleRefundList] = useState<any>([]);
  const {account, library} = useActiveWeb3React();
  const {UniswapStaker_Address} = DEPLOYED;
  const dispatch = useAppDispatch();

  let stakedPools = positionsByPool?.data?.positions?.filter((pool: any) => {
    return (
      ethers.utils.getAddress(pool.owner) ===
      ethers.utils.getAddress(UniswapStaker_Address)
    );
  });

  const blockNumberObj = useBlockNumber();
  const latestBlockNumber = blockNumberObj.blockNumber;

  useEffect(() => {
    setPageIndex(1);
    const pagenumber = parseInt(
      ((rewards.length - 1) / pageLimit + 1).toString(),
    );
    setPageOptions(pagenumber);
  }, [rewards, pageLimit]);

  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return rewards.slice(startIndex, endIndex);
  };

  useEffect(() => {
    setMultipleRefundList([]);
    setRefundNum(0);
    setSelectedRewards([]);
  }, [transactionType, blockNumber]);

  useEffect(() => {
    setPageIndex(1);
  }, [selectedPool, sortString, pageLimit]);
  const goToNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  const gotToPreviousPage = () => {
    setPageIndex(pageIndex - 1);
  };

  const {colorMode} = useColorMode();
  const theme = useTheme();

  const refundMultipleKeys = (key: any) => {
    let copyArr = [...multipleRefundList];
    const keyFound = multipleRefundList.find(
      (listkey: any) => JSON.stringify(listkey) === JSON.stringify(key),
    );
    const index = multipleRefundList.findIndex(
      (key: any) => JSON.stringify(key) === JSON.stringify(keyFound),
    );
    if (index > -1) {
      copyArr.splice(index, 1);
    } else {
      copyArr.push(key);
    }
    setRefundNum(copyArr.length);
    setMultipleRefundList(copyArr);
  };

  const getCheckedBoxes = (checkedReward: any) => {
    let tempRewards: any[] =
      selectedRewards.length === 0 ? [] : selectedRewards;
    const alreadyInArray = tempRewards.some(
      (reward) => reward.index === checkedReward.index,
    );
    if (selectedRewards.length === 0) {
      setSelectedRewards([checkedReward]);
    } else if (alreadyInArray) {
      let filteredArr = tempRewards.filter((reward: any) => {
        return reward.index !== checkedReward.index;
      });
      setSelectedRewards(filteredArr);
    } else {
      let copyRewards = Object.assign([], tempRewards);
      copyRewards.push(checkedReward);
      setSelectedRewards(copyRewards);
    }
  };

  return (
    <Flex justifyContent={'space-between'}>
      {rewards.length !== 0 ? (
        <Box flexWrap={'wrap'}>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap={30}
            h={'fit-content'}
            mb={'30px'}>
            {getPaginatedData().map((reward: any, index) => {
              let token0;
              let token1;
              let token0Image;
              let token1Image;
              const includedPool = pools.filter(
                (pool: any) => pool.id === reward.poolAddress,
              );
              const token = tokens.find((token)=> ethers.utils.getAddress(reward.rewardToken) === ethers.utils.getAddress(token.tokenAddress));
              const symbolImage = token?.tokenImage !== undefined? token?.tokenImage: ''     
              token0 = includedPool[0].token0.id;
              token1 = includedPool[0].token1.id;
              token0Image = includedPool[0].token0Image;
              token1Image = includedPool[0].token1Image;
              const rewardProps = {
                chainId: reward.chainId,
                poolName: reward.poolName,
                token0Address: token0,
                token1Address: token1,
                token0Image: token0Image,
                token1Image: token1Image,
                poolAddress: reward.poolAddress,
                rewardToken: reward.rewardToken,
                incentiveKey: reward.incentiveKey,
                startTime: reward.startTime,
                endTime: reward.endTime,
                allocatedReward: reward.allocatedReward,
                numStakers: reward.numStakers,
                status: reward.status,
                index: reward.index,
                rewardTokenSymbolImage:symbolImage,
              };
              return (
                <RewardProgramCardManage
                  key={index}
                  reward={rewardProps}
                  pageIndex={pageIndex}
                  sortString={sortString}
                  sendKey={refundMultipleKeys}
                  stakedPools={stakedPools}
                  getCheckedBoxes={getCheckedBoxes}
                  selectedRewards={selectedRewards}
                  LPTokens={LPTokens}
                  latestBlockNumber={latestBlockNumber}
                />
              );
            })}
          </Grid>
          <Flex
            mt={'22px'}
            position={'relative'}
            flexDir={'row'}
            justifyContent={'space-between'}>
            <Button
              w={'120px'}
              h={'33px'}
              bg={'blue.500'}
              color="white.100"
              mr={'10px'}
              fontFamily={theme.fonts.roboto}
              fontSize="14px"
              fontWeight="500"
              disabled={refundNum === 0}
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
              onClick={() => {
                dispatch(
                  openModal({
                    type: 'confirmMulticall',
                    data: {
                      userAddress: account,
                      library: library,
                      stakedPools,
                      multipleRefundList: multipleRefundList,
                      selectedRewards,
                    },
                  }),
                );
                // () =>
                // refundMultiple({
                //   userAddress: account,
                //   library: library,
                //   refundKeyList: multipleRefundList,
                //   stakedPools: stakedPools,
                // })
              }}>
              Multi Refund
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
                    setPageIndex(1);
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
        </Box>
      ) : (
        <Flex>
          {' '}
          <Text fontFamily={theme.fonts.fld} fontSize={'20px'}>
            You don't have any reward programs to refund
          </Text>{' '}
        </Flex>
      )}
      <ConfirmMulticallModal />
    </Flex>
  );
};