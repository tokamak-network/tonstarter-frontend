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
import {selectTransactionType} from 'store/refetch.reducer';
import {useAppSelector, useAppDispatch} from 'hooks/useRedux';
import {getPoolName} from '../../utils/token';
import {ClaimReward} from './components/ClaimReward';
import {RewardProgramCard} from './components/RewardProgramCard';
import {ChevronRightIcon, ChevronLeftIcon} from '@chakra-ui/icons';
import {stakeMultiple, unstakeMultiple} from './actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {LPToken} from './types';
import {getSigner} from 'utils/contract';
import {DEPLOYED} from 'constants/index';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {Contract} from '@ethersproject/contracts';
import {ethers} from 'ethers';
import {ConfirmMulticallModal} from './RewardModals';
import {openModal} from 'store/modal.reducer';
import {useBlockNumber} from 'hooks/useBlock';

type Pool = {
  id: string;
  liquidity: string;
  hourData: [];
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
  position?: LPToken;
  selectedPool?: Pool;
  pools: any[];
  sortString: string;
  positionsByPool: any;
  LPTokens: any;
};
const {UniswapStaker_Address} = DEPLOYED;

// let multipleStakeList: any = [];
// let multipleUnstakeList: any = [];
export const RewardContainer: FC<RewardContainerProps> = ({
  rewards,
  selectedPool,
  position,
  pools,
  sortString,
  positionsByPool,
  LPTokens,
}) => {
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [pageOptions, setPageOptions] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageLimit, setPageLimit] = useState<number>(6);
  const [unstakeNum, setUnstakeNum] = useState<number>(0);
  const [stakeNum, setStakeNum] = useState<number>(0);
  const {account, library} = useActiveWeb3React();
  const [staked, setstaked] = useState(true);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [selectedRewards, setSelectedRewards] = useState<any[]>([]);
  const [multipleStakeList, setMultipleStakeList] = useState<any[]>([]);
  const [multipleUnstakeList, setMultipleUnstakeList] = useState<any[]>([]);

  let stakedPools = positionsByPool?.data?.positions?.filter((pool: any) => {
    return (
      ethers.utils.getAddress(pool.owner) ===
      ethers.utils.getAddress(UniswapStaker_Address)
    );
  });

  const blockNumberObj = useBlockNumber();
  const latestBlockNumber = blockNumberObj.blockNumber;

  useEffect(() => {
    const pagenumber = parseInt(
      ((rewards.length - 1) / pageLimit + 1).toString(),
    );
    setPageOptions(pagenumber);
  }, [rewards, pageLimit, selectedPool, pageLimit]);

  useEffect(() => {
    setPageIndex(1);
  }, [selectedPool, sortString]);
  const getPaginatedData = () => {
    const startIndex = pageIndex * pageLimit - pageLimit;
    const endIndex = startIndex + pageLimit;
    return rewards.slice(startIndex, endIndex);
  };

  // useEffect(() => {
  //   setStakeNum(0);
  //   setUnstakeNum(0);
  // }, [
  //   transactionType,
  //   blockNumber,
  //   position,
  // ]);

  useEffect(() => {
    // This useEffect runs every time a user selects a new LP token to manage. Or if a txn has been submitted and completed
    async function checkStaked() {
      setStakeNum(0);
      setUnstakeNum(0);
      setSelectedRewards([]);
      setMultipleStakeList([]);
      setMultipleUnstakeList([]);
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const uniswapStakerContract = new Contract(
        UniswapStaker_Address,
        STAKERABI.abi,
        library,
      );
      const signer = getSigner(library, account);
      const depositInfo = await uniswapStakerContract
        .connect(signer)
        .deposits(Number(position ? position.id : '0'));
      if (depositInfo.owner.toLowerCase() === account.toLowerCase()) {
        setstaked(true);
      } else {
        setstaked(false);
      }
    }
    checkStaked();
  }, [position, transactionType, blockNumber]);

  const goToNextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  const gotToPreviousPage = () => {
    setPageIndex(pageIndex - 1);
  };

  const stakeMultipleKeys = (key: any) => {
    let copyArr = [...multipleStakeList];
    const keyFound = copyArr.find((listkey: any) => {
      return JSON.stringify(listkey) === JSON.stringify(key);
    });

    const index = copyArr.findIndex(
      (key: any) => JSON.stringify(key) === JSON.stringify(keyFound),
    );

    if (index > -1) {
      copyArr.splice(index, 1);
    } else {
      copyArr.push(key);
    }
    setMultipleStakeList(copyArr);
    setStakeNum(copyArr.length);
  };

  const unstakeMultipleKeys = (key: any) => {
    let copyArr = [...multipleUnstakeList];
    const keyFound = multipleUnstakeList.find(
      (listkey: any) => JSON.stringify(listkey) === JSON.stringify(key),
    );
    const index = multipleUnstakeList.findIndex(
      (key: any) => JSON.stringify(key) === JSON.stringify(keyFound),
    );
    if (index > -1) {
      copyArr.splice(index, 1);
    } else {
      copyArr.push(key);
    }
    setMultipleUnstakeList(copyArr);
    setUnstakeNum(copyArr.length);
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
            gap={'30px'}
            h={'fit-content'}
            mb={'30px'}>
            {getPaginatedData().map((reward: any, index) => {
              const includedPool = pools.find(
                (pool) => pool.id === reward.poolAddress,
              );
              const token0 = includedPool.token0.id;
              const token1 = includedPool.token1.id;
              const token0Image = includedPool.token0Image;
              const token1Image = includedPool.token1Image;
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
              };
              return (
                <RewardProgramCard
                  key={index}
                  reward={rewardProps}
                  selectedToken={position}
                  selectedPool={selectedPool ? selectedPool.id : ''}
                  sendKey={stakeMultipleKeys}
                  sendUnstakeKey={unstakeMultipleKeys}
                  pageIndex={pageIndex}
                  stakeList={multipleStakeList}
                  unstakeList={multipleUnstakeList}
                  sortString={sortString}
                  includedPoolLiquidity={includedPool.liquidity}
                  stakedPools={stakedPools}
                  LPTokens={LPTokens}
                  getCheckedBoxes={getCheckedBoxes}
                  latestBlockNumber={latestBlockNumber}
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
              disabled={
                position === undefined || (unstakeNum === 0 && stakeNum === 0)
              }
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
                      stakeKeyList: multipleStakeList,
                      unstakeKeyList: multipleUnstakeList,
                      tokenid: Number(position?.id),
                      userAddress: account,
                      library: library,
                      selectedRewards,
                    },
                  }),
                );

                // stakeMultiple({
                //   userAddress: account,
                //   tokenid: Number(position?.id),
                //   library: library,
                //   stakeKeyList: multipleStakeList,
                //   unstakeKeyList: multipleUnstakeList,
                // });
              }}>
              Multicall
            </Button>
            {/* <Button
              w={'120px'}
              h={'33px'}
              bg={'blue.500'}
              color="white.100"
              ml={'10px'}
              fontFamily={theme.fonts.roboto}
              fontSize="14px"
              fontWeight="500"
              disabled={position === undefined}
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
                unstakeMultiple({
                  userAddress: account,
                  tokenid: Number(position?.id),
                  library: library,
                  stakeKeyList: multipleUnstakeList,
                })
              }>
              Unstake Multiple
            </Button> */}
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
            There are no reward programs yet
          </Text>{' '}
        </Flex>
      )}
      <Flex>{/* <ClaimReward /> */}</Flex>
      <ConfirmMulticallModal />
    </Flex>
  );
};
