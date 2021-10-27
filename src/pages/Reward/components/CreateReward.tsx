import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Container,
  Select,
  Image,
  Input,
} from '@chakra-ui/react';

import {FC, useRef, useState, useEffect} from 'react';
// import {useAppSelector} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import clock from 'assets/svgs/poll_time_active_icon.svg';
import MomentLocaleUtils from 'react-day-picker/moment';
import {approve, create, checkApproved} from '../actions';
import Calendar from 'react-calendar';
import '../css/Calendar.css';
import calender_Forward_icon_inactive from 'assets/svgs/calender_Forward_icon_inactive.svg';
import calender_back_icon_inactive from 'assets/svgs/calender_back_icon_inactive.svg';
import moment from 'moment';
import {CustomCalendar} from './CustomCalendar';
import {CustomClock} from './CustomClock';

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
type CreateRewardProps = {
  pools: any[];
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

export const CreateReward: FC<CreateRewardProps> = ({pools}) => {
  // const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [claimableAmount, setClaimableAmount] = useState<Number>(100000.0);
  const [amount, setAmount] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [reward, setReward] = useState<Number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [startTimeArray, setStartTimeArray] = useState([]);
  const [endTimeArray, setEndTimeArray] = useState([]);
  const [endTime, setEndTime] = useState<number>(0);
  const [poolsArr, setPoolsArr] = useState([]);
  const [checkAllowed, setCheckAllowed] = useState<number>(0);
  useEffect(() => {
    let poolArr: any = [];
    poolArr = pools.map((pool) => {
      return pool.name;
    });
    setPoolsArr(poolArr);
    setName(poolArr[0]);
  }, [pools]);

  const onChangeSelectBoxPools = (e: any) => {
    const filterValue = e.target.value;
    setName(filterValue);
  };

  useEffect(() => {
    const ends = moment.unix(endTime);
    const endDates = moment(ends).set({
      hour: endTimeArray[0],
      minute: endTimeArray[1],
      second: endTimeArray[2],
    });
    setEndTime(endDates.unix());

    const starts = moment.unix(startTime);
    const startDates = moment(starts).set({
      hour: startTimeArray[0],
      minute: startTimeArray[1],
      second: startTimeArray[2],
    });
    setStartTime(startDates.unix());
  }, [startTimeArray, endTimeArray, endTime, startTime]);

  useEffect(() => {
    checkApproved(library, account, setCheckAllowed);
  }, [library, account, setCheckAllowed]);

  


  return (
    <Box display={'flex'} justifyContent={'flex-end'}>
      <Box
        boxShadow={'0 2px 5px 0 rgba(61, 73, 93, 0.1)'}
        border={colorMode === 'light' ? '' : '1px solid #535353'}
        h={'920px'}
        w={'284px'}
        p={'20px 15px'}
        borderRadius={'15px'}
        bg={colorMode === 'light' ? '#FFFFFF' : ''}>
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
          <Select
            h={'30px'}
            color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
            fontSize={'12px'}
            w={'190px'}
            onChange={onChangeSelectBoxPools}>
            {poolsArr.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </Select>
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
          />
          <CustomClock setTime={setStartTimeArray} />
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
            setValue={setEndTime}
            startTime={startTime}
            endTime={endTime}
            calendarType={'end'}
          />
          <CustomClock setTime={setEndTimeArray} />
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
            // onClick={() => createRewardFunc(account ? account.toString() : '')}
          >
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
            value={Number(amount)}
            onChange={(e) => {
              const {value} = e.target;
              setAmount(Number(value));
            }}
            _focus={{
              border: themeDesign.border[colorMode],
            }}
            color={themeDesign.font[colorMode]}
          />
        </Flex>
        <Flex mt={'27px'} justifyContent={'center'}>
          <Button
            w={'100px'}
            h={'38px'}
            bg={'blue.500'}
            mr={'10px'}
            color="white.100"
            fontSize="14px"
            disabled={amount === 0}
            _hover={{backgroundColor: 'blue.100'}}
            onClick={() =>
              approve({
                library: library,
                amount: amount,
                userAddress: account,
                setAlllowed: setCheckAllowed,
              })
            }>
            Approve
          </Button>
          <Button
            w={'100px'}
            h={'38px'}
            bg={'blue.500'}
            color="white.100"
            fontSize="14px"
            disabled={checkAllowed === 0}
            _hover={{backgroundColor: 'blue.100'}}
            onClick={() =>
              create({
                library: library,
                amount: amount,
                userAddress: account,
                startTime: startTime,
                endTime: endTime,
                name: name,
                setAlllowed: setCheckAllowed,
              })
            }>
            Create
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
