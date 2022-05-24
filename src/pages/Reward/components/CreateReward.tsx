import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Input,
  Menu,
  Tooltip,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {DEPLOYED} from 'constants/index';
import {FC,  useState, useEffect} from 'react';
import {useAppDispatch} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
// import clock from 'assets/svgs/poll_time_active_icon.svg';
// import MomentLocaleUtils from 'react-day-picker/moment';
import {approve, create, checkApproved} from '../actions';
// import Calendar from 'react-calendar';
import '../css/Calendar.css';
// import arrow_light from 'assets/images/select1_arrow_inactive.png';
// import arrow_dark from 'assets/svgs/select1_arrow_inactive.svg';
// import calender_Forward_icon_inactive from 'assets/svgs/calender_Forward_icon_inactive.svg';
// import calender_back_icon_inactive from 'assets/svgs/calender_back_icon_inactive.svg';
import moment from 'moment';
import {CustomCalendar} from './CustomCalendar';
import {CustomClock} from './CustomClock';
import {openModal} from 'store/modal.reducer';
import { ethers} from 'ethers';
import {ChevronDownIcon} from '@chakra-ui/icons';
import * as ERC20 from 'services/abis/ERC20.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {convertNumber} from 'utils/number';
import {shortenAddress} from 'utils';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

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
  borderDashed: {
    light: 'dashed 1px #dfe4ee',
    dark: 'dashed 1px #535353',
  },
};
type Pool = {
  feeTier: string;
  id: string;
  liquidity: string;
  hourData: [];
  tick: string;
  token0: {
    id: string;
    symbol: string;
  };
  token1: {
    id: string;
    symbol: string;
  };
};
type CreateRewardProps = {
  pools: Pool[];
  setSelectedPoolCreated: any;
};

type CreateReward = {
  poolName: string;
  poolAddress: string;
  rewardToken: string;
  incentiveKey: object;
  startTime: number;
  endTime: number;
  allocatedReward: string;
  numStakers: number;
  status: string;
  account: string;
  verified: boolean;
  tx: string;
  sig: string;
};
const { WTON_ADDRESS} = DEPLOYED;

export const CreateReward: FC<CreateRewardProps> = ({
  pools,
  setSelectedPoolCreated,
}) => {
  // const {data} = useAppSelector(selectModalType);
  const dispatch = useAppDispatch();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [amount, setAmount] = useState<string>('0');
  const [name, setName] = useState<string>('');
  const [reward, setReward] = useState<Number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [startTimeArray, setStartTimeArray] = useState([]);
  const [endTimeArray, setEndTimeArray] = useState([]);
  const [endTime, setEndTime] = useState<number>(0);
  const [checkAllowed, setCheckAllowed] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [tokeninfo, setTokeninfo] = useState([]);
  const [selectedPool, setSelectedPool] = useState<Pool>();
  const [rewardSymbol, setRewardSymbol] = useState('');
  const [rewardAddress, setRewardAddress] = useState('');
  const [created, setCreated] = useState();
  const [balance, setBalance] = useState(0);
  const [errorStart, setErrorStart] = useState<boolean>(false);
  const [errorEnd, setErrorEnd] = useState<boolean>(false);
  const [timeZone, setTimeZone] = useState<string>('');

  useEffect(() => {
    // setSelectedPool(pools[0]);
    // setSelectedAddress(pools[0].id);
    if (tokeninfo.length !== 0) {
      setRewardSymbol(tokeninfo[1]);
      setRewardAddress(tokeninfo[0]);
    } else {
      setRewardSymbol('');
      setRewardAddress('');
    }
  }, [tokeninfo]);

  // get user's timezone to pass into CustomClock
  useEffect(() => {
    const userDate = new Date();
    const sign = userDate.getTimezoneOffset() > 0 ? '-' : '+';
    const offset = Math.abs(userDate.getTimezoneOffset() / 60);
    const finalTimeZoneString = 'UTC' + sign + offset;
    setTimeZone(finalTimeZoneString);
  }, []);

  useEffect(() => {
    const pool = pools[0];
    const token1 = pool.token0.symbol;
    const token2 = pool.token1.symbol;
    setSelectedPool(pools[0]);
    setSelectedAddress(pools[0].id);
    const name = getPoolName(token1, token2);
    setName(name);
  }, []);
  const onChangeSelectBoxPools = (e: any) => {
    const filterValue = e.target.value;
    const selectedPool = pools.filter((pool: Pool) => pool.id === filterValue);
    const name = `${selectedPool[0].token0.symbol} / ${selectedPool[0].token1.symbol}`;
    setSelectedPoolCreated(selectedPool[0]);
    setName(name);
    setSelectedAddress(selectedPool[0].id);
    setSelectedPool(selectedPool[0]);
  };
  const getPoolName = (token0: string, token1: string): string => {
    return `${token0} / ${token1}`;
  };

  useEffect(() => {
    const ends = moment.unix(endTime);
    const endDates = moment(ends).set({
      hour: endTimeArray[0],
      minute: endTimeArray[1],
      second: endTimeArray[2],
    });

    if (endDates.unix() < 0) {
      setEndTime(0);
    } else {
      setEndTime(endDates.unix());
    }
    const starts = moment.unix(startTime);
    const startDates = moment(starts).set({
      hour: startTimeArray[0],
      minute: startTimeArray[1],
      second: startTimeArray[2],
    });

    setStartTime(startDates.unix());
  }, [startTimeArray, endTimeArray, endTime, startTime]);

  useEffect(() => {
    const maxStart = moment().unix() + 2592000;
    const maxEnd = startTime + 63072000;

    if (
      startTime > maxStart ||
      (startTime < moment().unix() && startTimeArray.length !== 0)
    ) {
      setErrorStart(true);
    } else if (startTime <= maxStart) {
      setErrorStart(false);
    }
    if (endTime > maxEnd) {
      setErrorEnd(true);
    } else if (endTime <= maxEnd) {
      setErrorEnd(false);
    }
  }, [startTime, endTime, startTimeArray]);

  useEffect(() => {
    const setApprovedAmount = async () => {
      if (rewardAddress !== '') {
        const approved = await checkApproved(
          library,
          account,
          setCheckAllowed,
          rewardAddress,
        );
        if (
          ethers.utils.getAddress(WTON_ADDRESS) ===
          ethers.utils.getAddress(rewardAddress)
        ) {
          setAmount(ethers.utils.formatUnits(approved.toString(), 27));
        } else {
          setAmount(ethers.utils.formatEther(approved.toString()));
        }
      } else {
        setAmount('0.0');
      }
    };
    setApprovedAmount();
  }, [
    library,
    account,
    setCheckAllowed,
    checkAllowed,
    rewardAddress,
    tokeninfo,
  ]);

  useEffect(() => {
    async function getBalance() {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      if (rewardAddress === ZERO_ADDRESS) {
      } else {
        if (
          account === null ||
          account === undefined ||
          library === undefined
        ) {
          return;
        }
        const signer = getSigner(library, account);
        try {
          const contract = new Contract(rewardAddress, ERC20.abi, library);
          const balanceOf = await contract.connect(signer).balanceOf(account);

          if (rewardAddress === WTON_ADDRESS) {
            const convertedRes = convertNumber({
              amount: balanceOf,
              type: 'ray',
            });
            setBalance(Number(convertedRes));
          } else {
            setBalance(
              Number(
                ethers.utils.formatEther(
                  balanceOf.toLocaleString('fullwide', {
                    useGrouping: false,
                  }),
                ),
              ),
            );
          }
        } catch (err) {}
      }
    }

    if (rewardAddress !== '') {
      getBalance();
    }
  }, [rewardAddress, checkAllowed, library, account, amount, tokeninfo]);
  const parse = (val: string) => val.replace(/^\$/, '');
  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Box w={'100%'} px={'15px'}>
        <Text
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize={'20px'}
          mb={'18px'}>
          Create a Reward Program
        </Text>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'64px'}>
            Pool
          </Text>
          <Menu isLazy>
            <MenuButton
              border={themeDesign.border[colorMode]}
              padding={'10px'}
              borderRadius={'4px'}
              h={'30px'}
              color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
              fontSize={'12px'}
              w={'190px'}>
              <Text
                w={'100%'}
                display={'flex'}
                flexDir={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                {' '}
                {`${selectedPool?.token0.symbol} / ${
                  selectedPool?.token1.symbol
                } (${parseInt(pools[0].feeTier) / 10000} %)`}
                <span>
                  <ChevronDownIcon />
                </span>
              </Text>
            </MenuButton>
            <MenuList
              m={'0px'}
              minWidth="190px"
              background={colorMode === 'light' ? '#ffffff' : '#222222'}>
              {pools.map((item, index) => (
                <MenuItem
                  onClick={onChangeSelectBoxPools}
                  h={'30px'}
                  color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
                  fontSize={'12px'}
                  w={'190px'}
                  m={'0px'}
                  value={item.id}
                  _hover={{background: 'transparent', color: 'blue.100'}}
                  _focus={{background: 'transparent'}}
                  key={index}>
                  {`${item.token0.symbol} / ${item.token1.symbol}    (${
                    parseInt(item.feeTier) / 10000
                  } %) `}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'64px'}>
            Start
          </Text>
          <CustomCalendar
            setValue={setStartTime}
            startTime={startTime}
            endTime={endTime}
            calendarType={'start'}
            created={created}
          />

          <CustomClock
            setTime={setStartTimeArray}
            error={errorStart}
            timeZone={timeZone}
          />
          <Tooltip
            isOpen={errorStart}
            placement="top"
            label="Start time should be within now and 30 days">
            <Text></Text>
          </Tooltip>
        </Flex>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'64px'}>
            End
          </Text>
          <CustomCalendar
            created={created}
            setValue={setEndTime}
            startTime={startTime}
            endTime={endTime}
            calendarType={'end'}
          />
          <CustomClock
            setTime={setEndTimeArray}
            error={errorEnd}
            timeZone={timeZone}
          />
          <Tooltip
            isOpen={errorEnd}
            placement="top"
            label="End time should be less than 2 years from start time">
            <Text></Text>
          </Tooltip>
        </Flex>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'64px'}>
            Reward
          </Text>

          <Input
            h={'30px'}
            w={'110px'}
            border={themeDesign.border[colorMode]}
            fontSize={'13px'}
            placeholder={'Search'}
            _focus={{
              border: themeDesign.border[colorMode],
            }}
            readOnly={true}
            value={rewardSymbol}
            color={themeDesign.font[colorMode]}
          />
          <Button
            w={'70px'}
            h={'30px'}
            bg={'blue.500'}
            color="white.100"
            ml={'10px'}
            fontSize="14px"
            _hover={{backgroundColor: 'blue.100'}}
            onClick={() =>
              dispatch(
                openModal({
                  type: 'search',
                  data: {getTokenInfo: setTokeninfo},
                }),
              )
            }>
            Search
          </Button>
        </Flex>
        <Flex justifyContent={'space-between'} alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'64px'}>
            Amount
          </Text>
          <Input
            h={'30px'}
            w={'190px'}
            border={themeDesign.border[colorMode]}
            fontSize={'13px'}
            value={amount}
            onChange={(e) => {
              const {value} = e.target;
              setAmount(value.replace(/^0*([^0]\d*\.\d{1,2}).*/g, '$1'));
            }}
            _focus={{
              border: themeDesign.border[colorMode],
            }}
            color={themeDesign.font[colorMode]}
          />
        </Flex>
        {/* <Text>{selectedPool}</Text> */}
        <Flex
          mt={'27px'}
          justifyContent={'center'}
          borderBottom={themeDesign.borderDashed[colorMode]}>
          <Button
            w={'100px'}
            h={'38px'}
            bg={'blue.500'}
            mr={'10px'}
            mb={'40px'}
            color="white.100"
            fontSize="14px"
            disabled={
              amount === '0' ||
              rewardAddress === '' ||
              Number(amount) <=
                (rewardAddress !== ''
                  ? ethers.utils.getAddress(rewardAddress) ===
                    ethers.utils.getAddress(WTON_ADDRESS)
                    ? Number(
                        ethers.utils.formatUnits(
                          checkAllowed.toLocaleString('fullwide', {
                            useGrouping: false,
                          }),
                          27,
                        ),
                      )
                    : Number(
                        ethers.utils
                          .formatEther(
                            checkAllowed.toLocaleString('fullwide', {
                              useGrouping: false,
                            }),
                          )
                          .toString(),
                      )
                  : 0) ||
              rewardAddress === ''
            }
            _hover={{backgroundColor: 'blue.100'}}
            onClick={() => {
              if (Number(amount) > balance) {
                if (
                  window.confirm(
                    `Even though you can approve this amount, you will not be able to create a reward with the same amount, since you don't have enough ${rewardSymbol} balance.`,
                  )
                ) {
                  approve({
                    library: library,
                    amount: amount,
                    userAddress: account,
                    setAlllowed: setCheckAllowed,
                    tokenAddress: rewardAddress,
                  });
                }
              } else {
                approve({
                  library: library,
                  amount: amount,
                  userAddress: account,
                  setAlllowed: setCheckAllowed,
                  tokenAddress: rewardAddress,
                });
              }
            }}>
            Approve
          </Button>
          <Button
            w={'100px'}
            h={'38px'}
            mb={'40px'}
            bg={'blue.500'}
            color="white.100"
            fontSize="14px"
            disabled={
              Number(
                ethers.utils
                  .formatEther(
                    checkAllowed.toLocaleString('fullwide', {
                      useGrouping: false,
                    }),
                  )
                  .toString(),
              ) === 0 ||
              Number(amount) >
                (rewardAddress !== ''
                  ? ethers.utils.getAddress(rewardAddress) ===
                    ethers.utils.getAddress(WTON_ADDRESS)
                    ? Number(
                        ethers.utils.formatUnits(
                          checkAllowed.toLocaleString('fullwide', {
                            useGrouping: false,
                          }),
                          27,
                        ),
                      )
                    : Number(
                        ethers.utils
                          .formatEther(
                            checkAllowed.toLocaleString('fullwide', {
                              useGrouping: false,
                            }),
                          )
                          .toString(),
                      )
                  : 0) ||
              Number(amount) === 0
            }
            _hover={{backgroundColor: 'blue.100'}}
            onClick={() => {
              const now = moment().unix();
              if (now > startTime) {
                return alert(`Please use select a start time greater than now`);
              } else if (balance < Number(amount)) {
                return alert(`You don't have enough ${rewardSymbol} balance`);
              }
              if (
                window.confirm(
                  `Are you sure you want to create the following Reward Program? 
                  Pool:  ${name}
                  Start time: ${moment
                    .unix(startTime)
                    .format('MM/DD/YYYY HH:mm:ss')}
                  End time: ${moment
                    .unix(endTime)
                    .format('MM/DD/YYYY HH:mm:ss')}
                  Reward token: ${rewardSymbol}
                  Reward amount: ${amount}
                  Creator: ${
                    account !== undefined && account !== null
                      ? shortenAddress(account)
                      : ''
                  }`,
                )
              ) {
                create({
                  library: library,
                  amount: amount,
                  userAddress: account,
                  poolAddress: selectedAddress,
                  startTime: startTime,
                  endTime: endTime,
                  name: name,
                  setAlllowed: setCheckAllowed,
                  setEnd: setEndTime,
                  setEndArr: setEndTimeArray,
                  setStart: setStartTime,
                  setStartArr: setStartTimeArray,
                  setRewardAddress: setRewardAddress,
                  rewardToken: rewardAddress,
                  setCreated: setCreated,
                  setTokeninfo: setTokeninfo,
                });
              }
            }}>
            Create
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};