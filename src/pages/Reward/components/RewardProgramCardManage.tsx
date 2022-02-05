import {FC, useState, useMemo, useEffect, useRef} from 'react';
import {
  Text,
  Flex,
  Select,
  Box,
  useTheme,
  useColorMode,
  Avatar,
  Image,
  Tooltip,
  Button,
  Progress,
  Checkbox,
} from '@chakra-ui/react';
import {useAppSelector} from 'hooks/useRedux';
import {checkTokenType} from 'utils/token';
import {selectTransactionType} from 'store/refetch.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import moment from 'moment';
import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {utils, ethers} from 'ethers';
import {soliditySha3} from 'web3-utils';
import {refund} from '../actions';
import {getTokenSymbol} from '../utils/getTokenSymbol';
import {UpdatedRedward} from '../types';
import {unstakeLP} from '../actions/unstakeLP';

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
type RewardProgramCardManageProps = {
  reward: UpdatedRedward;
  pageIndex: number;
  sortString: string;
  sendKey: (key: any) => void;
  stakedPools: any[];
};

const {WTON_ADDRESS, TON_ADDRESS, UniswapStaker_Address} = DEPLOYED;

export const RewardProgramCardManage: FC<RewardProgramCardManageProps> = ({
  reward,
  pageIndex,
  sortString,
  sendKey,
  stakedPools,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {REWARD_STYLE} = theme;
  const {account, library} = useActiveWeb3React();
  const [progress, setProgress] = useState<number>(0);
  const [dDay, setdDay] = useState<any>();
  const [tokenID, setTokenID] = useState<number>(7775);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [refundableAmount, setRefundableAmount] = useState<string>('0');
  const [numStakers, setNumStakers] = useState<number>(0);
  const [rewardSymbol, setRewardSymbol] = useState<string>('');
  const [isRefundSelected, setIsRefundSelected] = useState<boolean>(false);

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

  useEffect(() => {
    const getTokenFromContract = async (address: string) => {
      const symbolContract = await getTokenSymbol(address, library);
      setRewardSymbol(symbolContract);
    };

    getTokenFromContract(reward.rewardToken);
  }, [account, library]);

  useEffect(() => {
    const now = moment().unix();
    const start = moment.unix(Number(reward.startTime)).startOf('day').unix();
    const nowDay = moment.unix(now).startOf('day').unix();

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
    async function getIncentives() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }

      const incentiveABI =
        'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';
      const abicoder = ethers.utils.defaultAbiCoder;
      const incentiveId = soliditySha3(abicoder.encode([incentiveABI], [key]));
      const signer = getSigner(library, account);
      const incentiveInfo = await uniswapStakerContract
        .connect(signer)
        .incentives(incentiveId);

      setRefundableAmount(
        incentiveInfo.totalRewardUnclaimed.toLocaleString('fullwide', {
          useGrouping: false,
        }),
      );
      setNumStakers(Number(incentiveInfo.numberOfStakes));
    }

    getIncentives();
  }, [
    account,
    library,
    transactionType,
    blockNumber,
    tokenID,
    pageIndex,
    reward,
  ]);

  return (
    <Flex {...REWARD_STYLE.containerStyle({colorMode})} flexDir={'column'}>
      <Flex
        flexDir={'row'}
        width={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
        h={'50px'}>
        <Box>
          <Avatar
            src={reward.token0Image}
            bg={colorMode === 'light' ? '#ffffff' : '#222222'}
            name="T"
            border={
              colorMode === 'light' ? '1px solid #e7edf3' : '1px solid #3c3c3c'
            }
            h="50px"
            w="50px"
            zIndex={'100'}
          />
          <Avatar
            src={reward.token1Image}
            bg={colorMode === 'light' ? '#ffffff' : '#222222'}
            name="T"
            border={
              colorMode === 'light' ? '1px solid #e7edf3' : '1px solid #3c3c3c'
            }
            h="50px"
            w="50px"
            zIndex={'100'}
            ml={'-7px'}
          />
        </Box>
        <Flex flexDir={'row'} alignItems={'center'}>
          <Box>
            <Text textAlign={'right'}>
              {ethers.utils.getAddress(reward.rewardToken) ===
              ethers.utils.getAddress(WTON_ADDRESS)
                ? Number(
                    ethers.utils.formatUnits(refundableAmount, 27),
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                : Number(
                    ethers.utils.formatEther(refundableAmount.toString()),
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{' '}
              {checkTokenType(ethers.utils.getAddress(reward.rewardToken)).name}{' '}
              / {numStakers}
            </Text>
            <Flex flexDir={'row'}>
              <Text
                {...REWARD_STYLE.subText({colorMode, fontSize: 12})}
                mr={'2px'}>
                Refundable Amount{' '}
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
                / Stakers
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Flex>
      <Flex mt={'15px'} alignItems={'center'}>
        <Text {...REWARD_STYLE.mainText({colorMode})} mr={'10px'}>
        #{reward.index} {reward.poolName}
        </Text>
        <Box>
          <Text {...REWARD_STYLE.subText({colorMode, fontSize: 14})}>
            Reward Duration
          </Text>
          <Flex>
            {/* <Box> */}
              <Text {...REWARD_STYLE.subTextBlack({colorMode, fontSize: 14})} lineHeight={1}>
                {moment.unix(Number(reward.startTime)).format('YYYY.MM.DD')}
              </Text>
              {/* <Text
                {...REWARD_STYLE.subTextBlack({colorMode, fontSize: 11})}
                pb={'2px'}
                pl={'2px'}>
                ({moment.unix(Number(reward.startTime)).format('HH.mm.ss')}) 
              </Text> */}
              {/* </Box> */}
              <Text mb={'5px'} lineHeight={1} px={'5px'}>~{' '}</Text>
              {/* <Box> */}
              <Text {...REWARD_STYLE.subTextBlack({colorMode, fontSize: 14})} lineHeight={1}>
                {moment.unix(Number(reward.endTime)).format('YYYY.MM.DD')}
              </Text>
              {/* <Text
                {...REWARD_STYLE.subTextBlack({colorMode, fontSize: 11})}
                pb={'2px'}
                pl={'2px'}>
                ({moment.unix(Number(reward.endTime)).format('HH.mm.ss')})
              </Text> */}
            {/* </Box> */}
          </Flex>
        </Box>
      </Flex>
      <Flex mt={'24px'} flexDirection="row" justifyContent={'space-between'}>
        <Text {...REWARD_STYLE.progress.mainText({colorMode})}>Progress</Text>
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
                {
                  checkTokenType(
                    ethers.utils.getAddress(reward.rewardToken),
                    colorMode,
                  ).name
                }
              </Text>
            </Box>
          </Box>
          <Avatar
            ml={'10px'}
            src={
              checkTokenType(
                ethers.utils.getAddress(reward.rewardToken),
                colorMode,
              ).symbol
            }
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
          {numStakers !== 0 ||
          refundableAmount === '0' ||
          reward.endTime > moment().unix() ? null : (
            <Checkbox
              mt={'5px'}
              isChecked={isRefundSelected}
              onChange={(e) => {
                setIsRefundSelected(e.target.checked);
                sendKey(key);
              }}></Checkbox>
          )}

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
            disabled={
              refundableAmount === '0' || reward.endTime > moment().unix()
            }
            onClick={() =>
              numStakers === 0
                ? refund({library: library, userAddress: account, key: key})
                : unstakeLP({
                    library: library,
                    userAddress: account,
                    key: key,
                    reward: reward,
                    stakedPools,
                  })
            }>
            {numStakers > 0 ? 'Unstake LP' : 'Refund'}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
