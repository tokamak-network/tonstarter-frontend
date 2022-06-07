import {FC, useState, useEffect} from 'react';
import {
  Text,
  Flex,
  Box,
  useTheme,
  useColorMode,
  Avatar,
  Image,
  Tooltip,
  Checkbox,
  Button,
  Progress,
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {checkTokenType} from 'utils/token';
import {selectTransactionType} from 'store/refetch.reducer';
import {openModal} from 'store/modal.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import moment from 'moment';
import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import {approveStaking, stake, unstake} from '../actions';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import { ethers} from 'ethers';
import {soliditySha3} from 'web3-utils';
// import * as TOSABI from 'services/abis/TOS.json';
import {getTokenSymbol} from '../utils/getTokenSymbol';
import {UpdatedRedward} from '../types';
import {LPToken} from '../types';
import {convertNumber} from 'utils/number';
import {useDispatch} from 'react-redux';
import {gql, useQuery} from '@apollo/client';
import {rewardReducer} from '../reward.reducer';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';

const themeDesign = {
  border: {
    light: 'solid 1px #dfe4ee',
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
};
type RewardProgramCardProps = {
  reward: UpdatedRedward;
  selectedToken?: LPToken;
  selectedPool?: any;
  sendKey: (key: any) => any;
  sendUnstakeKey: (key: any) => any;
  pageIndex: number;
  stakeList: any[];
  unstakeList: any[];
  sortString: string;
  includedPoolLiquidity: string;
  stakedPools: any;
  LPTokens: any;
  getCheckedBoxes: (checkedBoxes: any) => any;
  latestBlockNumber: number;
};

const {
  WTON_ADDRESS,
  UniswapStaker_Address,
} = DEPLOYED;

export const RewardProgramCard: FC<RewardProgramCardProps> = ({
  reward,
  selectedToken,
  selectedPool,
  sendKey,
  sendUnstakeKey,
  pageIndex,
  stakeList,
  unstakeList,
  sortString,
  includedPoolLiquidity,
  stakedPools,
  LPTokens,
  getCheckedBoxes,
  latestBlockNumber,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {REWARD_STYLE} = theme;
  const {account, library} = useActiveWeb3React();
  const [progress, setProgress] = useState<number>(0);
  const [dDay, setdDay] = useState<any>();
  const [canApprove, setCanApprove] = useState<boolean>(false);
  const {NPM_Address, UniswapStaking_Address} = DEPLOYED;
  const [approved, setApproved] = useState<boolean>(false);
  const [myReward, setMyReward] = useState<number>(0);
  const [staked, setStaked] = useState<boolean>(false);
  const [buttonState, setButtonState] = useState<string>('Approve');
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [rewardSymbol, setRewardSymbol] = useState<string>('');
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isUnstakeSelected, setIsUnstakeselected] = useState<boolean>(false);
  const [numStakers, setNumStakers] = useState<number>(0);
  const TOKEN_CONTRACT = useContract(reward.rewardToken, ERC20.abi);
  const dispatch = useDispatch();

  const key = {
    rewardToken: reward.rewardToken,
    pool: reward.poolAddress,
    startTime: reward.startTime,
    endTime: reward.endTime,
    refundee: reward.incentiveKey.refundee,
  };

  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );

  // useEffect(()=> {
  //   async function getRewardToken() {
  //     if (account && TOKEN_CONTRACT) {
  //       const symbol = await TOKEN_CONTRACT.symbol();
  //       setRewardSymbol(symbol)
  //     }
  //   }
  //   getRewardToken()
  // },[account,reward ])

  useEffect(() => {
    setIsUnstakeselected(false);
    setIsSelected(false);
  }, [selectedToken]);
  useEffect(() => {
    const selected =
      stakeList.filter(
        (listkey: any) => JSON.stringify(listkey) === JSON.stringify(key),
      ).length > 0;
    setIsSelected(selected);
  }, [stakeList, pageIndex]);

  useEffect(() => {
    const selected =
      unstakeList.filter(
        (listkey: any) => JSON.stringify(listkey) === JSON.stringify(key),
      ).length > 0;
    setIsUnstakeselected(selected);
  }, [unstakeList, pageIndex]);

  useEffect(() => {
    const getTokenFromContract = async (address: string) => {
      const symbolContract = await getTokenSymbol(address, library);
      setRewardSymbol(symbolContract);
    };

    getTokenFromContract(reward.rewardToken);
  }, [account, library, pageIndex]);

  useEffect(() => {
    const now = moment().unix();
    const nowDay = moment.unix(now).startOf('day').unix();
    const start = moment.unix(Number(reward.startTime)).startOf('day').unix();
    const end = moment.unix(Number(reward.endTime)).endOf('day').unix();
    if (now < start) {
      const remainingDays = moment
        .unix(nowDay)
        .diff(moment.unix(Number(reward.startTime)), 'days');
      setdDay(remainingDays);
      setProgress(0);
    } else if (now > end) {
      const totalDays = moment
        .unix(Number(reward.endTime))
        .diff(moment.unix(Number(reward.startTime)), 'days');
      setdDay(totalDays);
      setProgress(100);
    } else {
      const totalDays = moment
        .unix(Number(reward.endTime))
        .diff(moment.unix(Number(reward.startTime)), 'days');
      const remainingDays = moment.unix(now).diff(moment.unix(start), 'days');
      setdDay(remainingDays);
      const progressCalc = (remainingDays / totalDays) * 100;
      setProgress(progressCalc);
    }
  }, [reward]);

  useEffect(() => {
    async function checkApproved() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const NPM = new Contract(NPM_Address, NPMABI.abi, library);
      const signer = getSigner(library, account);

      const isApprovedForAll = await NPM.connect(signer).isApprovedForAll(
        account,
        UniswapStaking_Address,
      );
      setApproved(isApprovedForAll);
    }
    async function checkStaked() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const signer = getSigner(library, account);
      const depositInfo = await uniswapStakerContract
        .connect(signer)
        .deposits(Number(selectedToken ? selectedToken.id : '0'));

      if (depositInfo.owner === account) {
        const incentiveABI =
          'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';
        const abicoder = ethers.utils.defaultAbiCoder;
        const incentiveId = soliditySha3(
          abicoder.encode([incentiveABI], [key]),
        );

        const stakeInfo = await uniswapStakerContract
          .connect(signer)
          .stakes(Number(selectedToken ? selectedToken.id : 0), incentiveId);

        const liquidity = Number(ethers.utils.formatEther(stakeInfo.liquidity));
        liquidity > 0 ? setStaked(true) : setStaked(false);
        getMyReward(liquidity);
      } else {
        setStaked(false);
      }
    }

    async function getMyReward(liquidity: any) {
      if (account === null || account === undefined || library === undefined) {
        return;
      }

      if (liquidity > 0) {
        const signer = getSigner(library, account);
        try {
          const rewardInfo = await uniswapStakerContract
            .connect(signer)
            .getRewardInfo(key, Number(selectedToken ? selectedToken.id : 0));
          setMyReward(rewardInfo.reward);
        } catch (err) {}
      }
    }
    checkApproved();
    checkStaked();
  }, [
    account,
    library,
    transactionType,
    blockNumber,
    selectedToken,
    approved,
    pageIndex,
    selectedPool,
    reward,
  ]);

  useEffect(() => {
    async function getIncentives() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }

      const incentiveABI =
        'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';
      const abicoder = ethers.utils.defaultAbiCoder;
      const incentiveId = soliditySha3(abicoder.encode([incentiveABI], [key]));
      const signer = getSigner(library, account);

      let totalStakerInfo: any[] = [];
      await Promise.all(
        stakedPools.map(async (pool: any) => {
          const incentiveInfo = await uniswapStakerContract
            .connect(signer)
            .stakes(Number(pool.id), incentiveId);

          const depositInfo = await uniswapStakerContract
            .connect(signer)
            .deposits(Number(pool.id));

          if (incentiveInfo.liquidity._hex !== '0x00') {
            if (
              totalStakerInfo.length > 0 &&
              totalStakerInfo.some(
                (data) => data.ownerAddress === depositInfo.owner,
              )
            ) {
              let index = totalStakerInfo.findIndex(
                (data: any) => data.ownerAddress === depositInfo.owner,
              );
              totalStakerInfo[index].liquidity += Number(
                ethers.utils.formatEther(incentiveInfo.liquidity),
              );
            } else {
              totalStakerInfo.push({
                ownerAddress: depositInfo.owner,
                liquidity: Number(
                  ethers.utils.formatEther(incentiveInfo.liquidity),
                ),
              });
            }
          }
        }),
      ).then(() => {
        const tempStakerInfo = totalStakerInfo.map((data: any) => {
          return {
            ownerAddress: data.ownerAddress,
          };
        });
        setNumStakers(tempStakerInfo.length);
      });
    }
    getIncentives();
  }, [
    account,
    library,
    transactionType,
    blockNumber,
    selectedToken,
    pageIndex,
    reward,
  ]);

  const getReward = async () => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    if (staked) {
      const signer = getSigner(library, account);
      try {
        const rewardInfo = await uniswapStakerContract
          .connect(signer)
          .getRewardInfo(key, Number(selectedToken ? selectedToken.id : 0));
        setMyReward(rewardInfo.reward);
      } catch (err) {}
    }
  };

  useEffect(() => {
    const interval = setInterval(() => getReward(), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const setButton = () => {
      const now = moment().unix();
      if (!approved && now > reward.startTime && !staked) {
        setCanApprove(true);
        setButtonState('Approve');
      }
      if (
        approved &&
        now > reward.startTime &&
        now < reward.endTime &&
        !staked
      ) {
        setButtonState('Stake');
      }
      // else if (staked && now < reward.endTime) {
      //   setButtonState('In Progress');
      // }
      else if (staked) {
        setButtonState('Unstake');
      } else if (!staked && now > reward.endTime) {
        setButtonState('Closed');
      } else if (approved && now < reward.startTime) {
        setButtonState('Waiting');
      }
    };
    setButton();
  }, [
    sortString,
    reward,
    approved,
    staked,
    account,
    pageIndex,
    library,
    transactionType,
    blockNumber,
    selectedToken,
  ]);

  const buttonFunction = (buttonCase: string) => {
    if (buttonCase === 'Approve') {
      approveStaking({
        userAddress: account,
        library: library,
      });
    }
    if (buttonCase === 'Stake') {
      stake({
        library: library,
        tokenid: Number(selectedToken ? selectedToken.id : 0),
        userAddress: account,
        startTime: reward.startTime,
        endTime: reward.endTime,
        rewardToken: reward.rewardToken,
        poolAddress: reward.poolAddress,
        refundee: reward.incentiveKey.refundee,
        staked: staked,
      });
    }
    if (buttonCase === 'Unstake') {
      unstake({
        library: library,
        tokenid: Number(selectedToken ? selectedToken.id : 0),
        userAddress: account,
        startTime: reward.startTime,
        endTime: reward.endTime,
        rewardToken: reward.rewardToken,
        poolAddress: reward.poolAddress,
        refundee: reward.incentiveKey.refundee,
      });
    }
  };

  return (
    <Flex
      {...REWARD_STYLE.containerStyle({colorMode})}
      flexDir={'column'}
      onClick={() => {
        dispatch(
          openModal({
            type: 'information',
            data: {
              reward,
              stakedPools,
              key,
              userAddress: account,
              positions: LPTokens,
              blockNumber: latestBlockNumber,
            },
          }),
        );
      }}
      _hover={{
        border: '2px solid #0070ED',
        cursor: 'pointer',
      }}>
      <Flex flexDir={'row'} width={'100%'} alignItems={'center'} h={'50px'}>
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Box>
            <Avatar
              src={reward.token0Image}
              bg={colorMode === 'light' ? '#ffffff' : '#222222'}
              name="T"
              border={
                colorMode === 'light'
                  ? '1px solid #e7edf3'
                  : '1px solid #3c3c3c'
              }
              h="50px"
              w="50px"
              zIndex={'100'}
            />
            <Avatar
              src={reward.token1Image}
              bg={colorMode === 'light' ? '#ffffff' : '#222222'}
              name="T"
              h="50px"
              border={
                colorMode === 'light'
                  ? '1px solid #e7edf3'
                  : '1px solid #3c3c3c'
              }
              w="50px"
              ml={'-7px'}
            />
          </Box>
          <Text {...REWARD_STYLE.subText({colorMode, fontSize: 14})} mt={'2px'}>
            {reward.poolName}
          </Text>
        </Box>
        {staked && selectedToken ? (
          <Flex flexDir={'row'} alignItems={'center'}>
            <Box
              w={'8px'}
              h={'8px'}
              borderRadius={50}
              bg={'#f95359'}
              m={'7px'}></Box>
            <Text
              {...{
                ...REWARD_STYLE.joinedText({
                  colorMode,
                  fontSize: 11,
                }),
              }}
              mr={'25px'}>
              Joined
            </Text>
            <Box textAlign={'right'}>
              <Text>
                {ethers.utils.getAddress(reward.rewardToken) ===
                ethers.utils.getAddress(WTON_ADDRESS)
                  ? Number(ethers.utils.formatUnits(myReward, '27')) < 0.005
                    ? '<0.00'
                    : Number(
                        ethers.utils.formatUnits(myReward, '27'),
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })
                  : Number(ethers.utils.formatEther(myReward)) < 0.005
                  ? '<0.00'
                  : Number(ethers.utils.formatEther(myReward)).toLocaleString(
                      undefined,
                      {
                        maximumFractionDigits: 2,
                      },
                    )}{' '}
                {
                  checkTokenType(ethers.utils.getAddress(reward.rewardToken))
                    .name
                }{' '}
                /{' '}
                {parseFloat(
                  (
                    (Number(ethers.utils.formatEther(selectedToken.liquidity)) *
                      100) /
                    Number(ethers.utils.formatEther(includedPoolLiquidity))
                  ).toFixed(3),
                )}
                %
              </Text>
              <Flex flexDir={'row'}>
                <Text
                  {...REWARD_STYLE.subText({colorMode, fontSize: 12})}
                  mr={'2px'}>
                  My Reward{' '}
                </Text>
                <Tooltip
                  hasArrow
                  placement="top"
                  label="These are the rewards that are allocated when you currently unstake. Depending on the time of unstaking, the reward amount may vary."
                  color={theme.colors.white[100]}
                  bg={theme.colors.gray[375]}>
                  <Image src={tooltipIcon} mr={'2px'} />
                </Tooltip>

                <Text {...REWARD_STYLE.subText({colorMode, fontSize: 12})}>
                  / My liquidity portion
                </Text>
              </Flex>
            </Box>
          </Flex>
        ) : (
          ''
        )}
      </Flex>
      <Flex mt={'15px'} alignItems={'center'}>
        <Text
          cursor={'pointer'}
          {...REWARD_STYLE.mainText({colorMode, fontSize: 30})}
          mr={'10px'}
          onClick={(e) => {
            e.preventDefault();
            window.open(
              `https://info.uniswap.org/#/pools/${reward.poolAddress}`,
            );
          }}>
          #{reward.index}
        </Text>
        <Box>
          <Text {...REWARD_STYLE.subText({colorMode, fontSize: 14})}>
            Reward Duration
          </Text>
          <Flex>
            {/* <Box> */}
            <Text
              {...REWARD_STYLE.subTextBlack({colorMode, fontSize: 14})}
              lineHeight={1}>
              {moment.unix(Number(reward.startTime)).format('YYYY.MM.DD')}
            </Text>
            <Text
              {...REWARD_STYLE.subTextBlack({colorMode, fontSize: 11})}
              pb={'2px'}
              pl={'2px'}>
              ({moment.unix(Number(reward.startTime)).format('HH:mm')})
            </Text>
            {/* </Box> */}
            <Text mb={'5px'} lineHeight={1} px={'5px'}>
              ~{' '}
            </Text>
            {/* <Box> */}
            <Text
              {...REWARD_STYLE.subTextBlack({colorMode, fontSize: 14})}
              lineHeight={1}>
              {/*If years are same for start and end times, remove the year from the end time. */}
              {moment.unix(Number(reward.endTime)).format('YYYY') ===
              moment.unix(Number(reward.startTime)).format('YYYY')
                ? moment.unix(Number(reward.endTime)).format('MM.DD')
                : moment.unix(Number(reward.endTime)).format('YYYY.MM.DD')}
            </Text>
            <Text
              {...REWARD_STYLE.subTextBlack({colorMode, fontSize: 11})}
              pb={'2px'}
              pl={'2px'}>
              ({moment.unix(Number(reward.endTime)).format('HH:mm')})
            </Text>
            {/* </Box> */}
          </Flex>
        </Box>
      </Flex>
      <Flex mt={'24px'} flexDirection="row" justifyContent={'space-between'}>
        <Flex alignItems={'center'}>
          <Text {...REWARD_STYLE.progress.mainText({colorMode})}>Progress</Text>
          <Text ml={'8px'} fontSize={'12px'} color={'#0070ed'}>
            {numStakers} Stakers
          </Text>
        </Flex>

        <Box d="flex" flexDir="row">
          <Text
            {...REWARD_STYLE.progress.subText({colorMode, fontSize: 12})}
            fontWeight={'bold'}>
            D-day
          </Text>
          <Text
            fontWeight={'bold'}
            {...REWARD_STYLE.progress.percent({})}
            mx={'2px'}>
            {dDay}
          </Text>
          <Text {...REWARD_STYLE.progress.subText({colorMode, fontSize: 12})}>
            / Total Days
          </Text>
          <Text
            fontWeight={'bold'}
            {...REWARD_STYLE.progress.subText({
              colorMode,
              fontSize: 12,
            })}
            ml={'2px'}>
            {moment
              .unix(Number(reward.endTime))
              .diff(moment.unix(Number(reward.startTime)), 'days')}
          </Text>
        </Box>
      </Flex>
      <Box mt={'5px'}>
        <Progress value={progress} borderRadius={10} h={'6px'}></Progress>
      </Box>
      <Flex
        mt={'30px'}
        flexDirection="row"
        alignItems={'center'}
        justifyContent={'space-between'}>
        <Flex alignItems={'center'}>
          <Box>
            <Text
              {...REWARD_STYLE.mainText({
                colorMode,
                fontSize: 14,
              })}>
              Total Reward
            </Text>
            <Box d="flex" alignItems="baseline">
              <Text
                {...REWARD_STYLE.mainText({
                  colorMode,
                  fontSize: 20,
                })}
                lineHeight={'0.7'}>
                {ethers.utils.getAddress(reward.rewardToken) ===
                ethers.utils.getAddress(WTON_ADDRESS)
                  ? Number(
                      ethers.utils.formatUnits(reward.allocatedReward, 27),
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })
                  : Number(
                      ethers.utils.formatEther(
                        reward.allocatedReward.toString(),
                      ),
                    ).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
              </Text>
              <Text ml="2px" fontSize="13">
                {TOKEN_CONTRACT !== null? rewardSymbol: ''}
              </Text>
            </Box>
          </Box>
          <Avatar
            ml={'10px'}
            src={reward.rewardTokenSymbolImage !== ''? reward.rewardTokenSymbolImage : "" }
            bg={colorMode === 'light' ? '#ffffff' : '#222222'}
            name="T"
            border={
              colorMode === 'light' ? '1px solid #e7edf3' : '1px solid #3c3c3c'
            }
            h="22px"
            w="22px"
            zIndex={'100'}
          />
        </Flex>
        <Flex flexDirection="row" justifyContent={'center'}>
          {buttonState === 'Stake' &&
          moment().unix() > reward.startTime &&
          !staked &&
          reward.poolAddress === (selectedToken ? selectedToken.pool.id : '') &&
          Number(selectedToken ? selectedToken.id : 0) !== 0 &&
          (selectedToken && buttonState === 'Stake'
            ? selectedToken.range &&
              Number(ethers.utils.formatEther(selectedToken.liquidity)) !== 0
            : false) ? (
            <Box pb={'0px'}>
              {/* the label tag is needed for e.stopPropagation to work. Can't put stopPropagation directly in the checkbox element. */}
              <label onClick={(e: any) => e.stopPropagation()}>
                <Checkbox
                  mt={'5px'}
                  zIndex={100}
                  isChecked={isSelected}
                  onChange={(e) => {
                    setIsSelected(e.target.checked);
                    sendKey(key);
                    getCheckedBoxes(reward);
                  }}
                />
              </label>
            </Box>
          ) : null}

          {buttonState === 'Unstake' &&
          moment().unix() > reward.startTime &&
          staked &&
          Number(selectedToken ? selectedToken.id : 0) !== 0 ? (
            <Box pb={'0px'}>
              {/* the label tag is needed for e.stopPropagation to work. Can't put stopPropagation directly in the checkbox element. */}
              <label onClick={(e: any) => e.stopPropagation()}>
                <Checkbox
                  mt={'5px'}
                  zIndex={100}
                  isChecked={isUnstakeSelected}
                  onClick={(e) => e.preventDefault()}
                  onChange={(e) => {
                    e.preventDefault();
                    setIsUnstakeselected(e.target.checked);
                    sendUnstakeKey(key);
                    getCheckedBoxes(reward);
                  }}
                />
              </label>
            </Box>
          ) : null}
          <Button
            w={'120px'}
            h={'33px'}
            bg={'blue.500'}
            color="white.100"
            ml={'10px'}
            fontSize="16px"
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
            onClick={(e: any) => {
              e.stopPropagation();
              buttonFunction(buttonState);
            }}
            disabled={
              moment().unix() < reward.startTime ||
              buttonState === 'Closed' ||
              buttonState === 'In Progress' ||
              Number(selectedToken ? selectedToken.id : 0) === 0 ||
              reward.poolAddress !==
                (selectedToken ? selectedToken.pool.id : '') ||
              (staked && buttonState === 'Stake') ||
              (selectedToken && buttonState !== 'Unstake'
                ? !selectedToken.range ||
                  Number(ethers.utils.formatEther(selectedToken.liquidity)) ===
                    0
                : false)
            }>
            {buttonState}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};