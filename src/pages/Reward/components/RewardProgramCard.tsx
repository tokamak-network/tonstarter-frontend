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
} from '@chakra-ui/react';
import {useAppSelector} from 'hooks/useRedux';
import {checkTokenType} from 'utils/token';
import {useActiveWeb3React} from 'hooks/useWeb3';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import moment from 'moment';
import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import {approveStaking, stake} from '../actions';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';

type incentiveKey = {
  rewardToken: string;
  pool: string;
  startTime: Number;
  endTime: Number;
  refundee: string;
};

type Reward = {
  chainId: number;
  poolName: string;
  token1Address: string;
  token2Address: string;
  poolAddress: string;
  rewardToken: string;
  incentiveKey: incentiveKey;
  startTime: Number;
  endTime: Number;
  allocatedReward: string;
  numStakers: Number;
  status: string;
};
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
  reward: Reward;
};

const {UniswapStaking_Address} = DEPLOYED;

export const RewardProgramCard: FC<RewardProgramCardProps> = ({reward}) => {
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

  useEffect(() => {
    const now = moment().unix();
    const start = moment.unix(Number(reward.startTime)).startOf('day').unix();

    if (reward.startTime < now) {
      setCanApprove(true);
    }
    const end = moment.unix(Number(reward.endTime)).endOf('day').unix();
    if (now < start) {
      const remainingDays = moment
        .unix(now)
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
    if (account !== undefined && library !== undefined) {
      checkApproved();
    }
    /*eslint-disable*/
  }, [account, library]);

  useEffect(() => {
    async function getMyReward() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const key = {
        rewardToken: reward.rewardToken,
        pool: reward.poolAddress,
        startTime: reward.startTime,
        endTime: reward.endTime,
        refundee: reward.incentiveKey.refundee,
      };
      console.log(key);
      
      const uniswapStakerContract = new Contract(
        UniswapStaking_Address,
        STAKERABI.abi,
        library,
      );
      
      const signer = getSigner(library, account);
      try {
        console.log('came to my info');
        
        const rewardInfo = await uniswapStakerContract.connect(signer).getRewardInfo(key, Number(6173));
        console.log('rewardInfo', rewardInfo);
      } catch (err) {
        console.log('no reward');
        
      }
    }
    if (account !== undefined && library !== undefined) {
      getMyReward();
    }
  }, [account, library]);

  return (
    <Flex {...REWARD_STYLE.containerStyle({colorMode})} flexDir={'column'}>
      <Flex flexDir={'row'} width={'100%'} alignItems={'center'} h={'50px'}>
        <Box>
          <Avatar
            src={checkTokenType(reward.token1Address).symbol}
            backgroundColor={checkTokenType(reward.token1Address).bg}
            bg="transparent"
            color="#c7d1d8"
            name="T"
            border={checkTokenType(reward.token1Address).border}
            h="50px"
            w="50px"
            zIndex={'100'}
          />
          <Avatar
            src={checkTokenType(reward.token2Address).symbol}
            backgroundColor={checkTokenType(reward.token2Address).bg}
            bg="transparent"
            color="#c7d1d8"
            name="T"
            h="50px"
            w="50px"
            ml={'-7px'}
            border={checkTokenType(reward.token2Address).border}
          />
        </Box>
        {account === reward.incentiveKey.refundee ? (
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
              mr={'30px'}>
              Joined
            </Text>
            <Box>
              <Text>1,000,000.00 TOS / 10%</Text>
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
                  / My portion
                </Text>
              </Flex>
            </Box>
          </Flex>
        ) : (
          ''
        )}
      </Flex>
      <Flex mt={'15px'} alignItems={'center'}>
        <Text {...REWARD_STYLE.mainText({colorMode})} mr={'10px'}>
          {reward.poolName}
        </Text>
        <Box>
          <Text {...REWARD_STYLE.subText({colorMode, fontSize: 12})}>
            Reward Date
          </Text>
          <Text {...REWARD_STYLE.subTextBlack({colorMode, fontSize: 14})}>
            {moment.unix(Number(reward.startTime)).format('YYYY.MM.DD')} ~{' '}
            {moment.unix(Number(reward.endTime)).format('YYYY.MM.DD')}
          </Text>
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
        <Box>
          <Text
            {...REWARD_STYLE.mainText({
              colorMode,
              fontSize: 14,
            })}>
            Total Raise
          </Text>
          <Box d="flex" alignItems="baseline">
            <Text
              {...REWARD_STYLE.mainText({
                colorMode,
                fontSize: 20,
              })}
              lineHeight={'0.7'}>
              {Number(reward.allocatedReward).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
            <Text ml="2px" fontSize="13">
              {checkTokenType(reward.rewardToken).name}
            </Text>
          </Box>
        </Box>
        <Button
          w={'120px'}
          h={'33px'}
          bg={'blue.500'}
          color="white.100"
          ml={'10px'}
          fontSize="16px"
          _hover={{backgroundColor: 'blue.100'}}
          onClick={() =>
            approved
              ? stake({
                  library: library,
                  tokenid: 5923,
                  userAddress: account,
                  startTime: reward.startTime,
                  endTime: reward.endTime,
                  rewardToken: reward.rewardToken,
                  poolAddress: reward.poolAddress,
                  refundee: reward.incentiveKey.refundee,
                })
              : approveStaking({
                  userAddress: account,
                  library: library,
                })
          }
          disabled={!canApprove}>
          {canApprove ? (approved ? 'Stake' : 'Approve') : 'Approve'}
        </Button>
      </Flex>
    </Flex>
  );
};
