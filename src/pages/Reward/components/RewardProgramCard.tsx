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
  Checkbox,
  Button,
  Progress,
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
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import {approveStaking, stake, unstake} from '../actions';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {utils, ethers} from 'ethers';
import {soliditySha3} from 'web3-utils';
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
  token0Address: string;
  token1Address: string;
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
  selectedToken: number;
  sendKey: (key: any)=> void
};

const {UniswapStaking_Address, UniswapStaker_Address} = DEPLOYED;

export const RewardProgramCard: FC<RewardProgramCardProps> = ({
  reward,
  selectedToken,
  sendKey,
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
  const [withdraw, setWithdraw] = useState<boolean>(false);
  const [buttonState, setButtonState] = useState<string>('Approve');
  const [tokenID, setTokenID] = useState<number>(7774);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);

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
    const now = moment().unix();
    const start = moment.unix(Number(reward.startTime)).startOf('day').unix();
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
    async function checkStaked() {
      // const tokenID = tokenID;
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const signer = getSigner(library, account);
      const depositInfo = await uniswapStakerContract
        .connect(signer)
        .deposits(tokenID);
      if (depositInfo.owner === account) {
        const incentiveABI =
          'tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)';
        const abicoder = ethers.utils.defaultAbiCoder;
        const incentiveId = soliditySha3(
          abicoder.encode([incentiveABI], [key]),
        );
        const stakeInfo = await uniswapStakerContract
          .connect(signer)
          .stakes(tokenID, incentiveId);

        stakeInfo.liquidity > 0 ? setStaked(true) : setStaked(false);
      }
    }

    async function getMyReward() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      if (staked) {
        const signer = getSigner(library, account);
        try {
          const rewardInfo = await uniswapStakerContract
            .connect(signer)
            .getRewardInfo(key, Number(tokenID));
          const myReward = Number(rewardInfo.reward);
          setMyReward(myReward);
        } catch (err) {}
      }
    }

    // async function checkUnstaked () {
    //   if (account === null || account === undefined || library === undefined) {
    //     return;
    //   }
    //   const signer = getSigner(library, account);
    //   const depositInfo = await uniswapStakerContract
    //     .connect(signer)
    //     .deposits(tokenID);
    //   console.log('deposits', depositInfo);
    //   if (depositInfo.owner === account && depositInfo.numberOfStakes===0) {
    //     setWithdraw(true);

    //   }
    // }

    checkApproved();
    checkStaked();
    getMyReward();
    // checkUnstaked();
    /*eslint-disable*/
  }, [account, library, transactionType, blockNumber, tokenID, approved]);

  useEffect(() => {
    const now = moment().unix();
    if (!approved && now > reward.startTime) {
      setCanApprove(true);
      setButtonState('Approve');
    }
    if (approved && now < reward.endTime) {
      setButtonState('Stake');
    }
    if (staked && now < reward.endTime) {
      setButtonState('In Progress');
    }
    if (staked && now > reward.endTime) {
      setButtonState('Unstake');
    }
    if (!staked && now > reward.endTime) {
      setButtonState('Closed');
    }
    // if (withdraw && buttonState==='Closed') {
    //   setButtonState('Withdraw');
    // }
  }, [approved, staked]);

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
        tokenid: selectedToken,
        userAddress: account,
        startTime: reward.startTime,
        endTime: reward.endTime,
        rewardToken: reward.rewardToken,
        poolAddress: reward.poolAddress,
        refundee: reward.incentiveKey.refundee,
      });
      setTokenID(selectedToken);
    }
    if (buttonCase === 'Unstake') {
      unstake({
        library: library,
        tokenid: tokenID,
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
    <Flex {...REWARD_STYLE.containerStyle({colorMode})} flexDir={'column'}>
      <Flex flexDir={'row'} width={'100%'} alignItems={'center'} h={'50px'}>
        <Box>
          <Avatar
            src={checkTokenType(reward.token0Address).symbol}
            backgroundColor={checkTokenType(reward.token0Address).bg}
            bg="transparent"
            color="#c7d1d8"
            name="T"
            border={checkTokenType(reward.token0Address).border}
            h="50px"
            w="50px"
            zIndex={'100'}
          />
          <Avatar
            src={checkTokenType(reward.token1Address).symbol}
            backgroundColor={checkTokenType(reward.token1Address).bg}
            bg="transparent"
            color="#c7d1d8"
            name="T"
            h="50px"
            w="50px"
            ml={'-7px'}
            border={checkTokenType(reward.token1Address).border}
          />
        </Box>
        {staked ? (
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
              <Text>
                {Number(
                  ethers.utils.formatEther(myReward.toString()),
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}{' '}
                {checkTokenType(reward.rewardToken).name} /{' '}
                {parseFloat(
                  (
                    (Number(ethers.utils.formatEther(myReward.toString())) *
                      100) /
                    Number(
                      ethers.utils.formatEther(
                        reward.allocatedReward.toString(),
                      ),
                    )
                  ).toFixed(4),
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
              {Number(
                ethers.utils.formatEther(reward.allocatedReward.toString()),
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
            <Text ml="2px" fontSize="13">
              {checkTokenType(reward.rewardToken).name}
            </Text>
          </Box>
        </Box>

        <Flex flexDirection="row" justifyContent={'center'}>
          {buttonState === 'Stake' && moment().unix() > reward.startTime ? (
            <Box pb={'0px'}>
              <Checkbox mt={'5px'} onChange={() => sendKey(key)}></Checkbox>
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
            _disabled={colorMode==='light' ? {backgroundColor: 'gray.25', cursor: 'default', color: '#86929d'}: {backgroundColor: '#353535', cursor: 'default', color: '#838383'}}
            onClick={() => buttonFunction(buttonState)}
            disabled={
              moment().unix() < reward.startTime ||
              buttonState === 'Closed' ||
              buttonState === 'In Progress'
            }>
            {buttonState}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
