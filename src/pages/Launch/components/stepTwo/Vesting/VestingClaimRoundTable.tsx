import {
  Box,
  Flex,
  Input,
  InputGroup,
  Select,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import useClaimRound from '@Launch/hooks/useClaimRound';
import {
  saveTempVaultData,
  selectLaunch,
  setClaimRoundTable,
} from '@Launch/launch.reducer';
import {Projects, VaultPublic, VaultSchedule} from '@Launch/types';
import {CustomSelectBox} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {useFormikContext} from 'formik';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import moment from 'moment';
import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import commafy from 'utils/commafy';
import {convertTimeStamp} from 'utils/convertTIme';
import truncNumber from 'utils/truncNumber';
import SingleCalendarPop from '../../common/SingleCalendarPop';
import ClaimRoundInput from '../ClaimRound/ClaimRoundInputs';
import VestingClaimRoundInput from './VestingClaimRoundInput';

const selectOptionValues = ['30', '60'];
const selectOptionNames = ['30 Days', '60 Days'];

const InputTitle = (props: {
  title: string;
  isRequired?: boolean;
  isErr?: boolean;
  errMsg?: string;
  style?: {};
}) => {
  const {title, isRequired, isErr, errMsg, style} = props;
  const {colorMode} = useColorMode();
  return (
    <Flex
      fontSize={13}
      color={colorMode === 'light' ? '#2d3136' : '#f3f4f1'}
      // w={title !== 'Interval' ? '109px' : '44px'}
      border={isErr ? '1px solid #ff3b3b' : ''}
      pos={'relative'}
      {...style}>
      {isRequired && (
        <Text color={'red.100'} mr={'3px'} pt={'3px'}>
          *
        </Text>
      )}
      <Text>{title}</Text>
      {errMsg && <Text pos={'absolute'}>{errMsg}</Text>}
    </Flex>
  );
};

function inputValidate(input: number) {
  const validation = input === 0 || input === undefined || input === null;
  return validation;
}

function onChange(e: Event, setState: Dispatch<React.SetStateAction<any>>) {
  const target = e.target as HTMLInputElement;
  setState(Number(target.value));
}

const VestingClaimRoundTable = (props: {isVesting?: boolean}) => {
  const {isVesting} = props;
  const {colorMode} = useColorMode();
  const [roundNum, setRoundnum] = useState<number>(0);
  const [date1st, setDate1st] = useState<number>(0);
  const [interval, setInterval] = useState<'30' | '60'>('30');
  const [amount, setAmount] = useState<number>(0);
  const [eachRound, setEachRound] = useState<number>(0);
  const [eachEndRound, setEachEndRound] = useState<number>(0);

  const [btnDisable, setBtnDisable] = useState<boolean>(true);

  const middleStyle = {
    border: colorMode === 'light' ? 'solid 1px #eff1f6' : 'solid 1px #373737',
  };

  const {
    data: {claimRoundTable, selectedVaultIndex, uncompletedVaultIndex},
  } = useAppSelector(selectLaunch);
  const dispatch = useAppDispatch();
  const {values} = useFormikContext<Projects['CreateProject']>();
  const {totalClaimAmount} = useClaimRound();
  const [test, setTest] = useState<any>('-');
  const {publicRound2End} = values.vaults[0] as VaultPublic;

  useEffect(() => {
    setTest(totalClaimAmount);
  }, [totalClaimAmount]);

  const autoFill = useCallback(() => {
    const claimList: VaultSchedule[] = [];
    const eachRoundLength = eachEndRound - eachRound + 1;
    let acc = 0;

    dispatch(
      saveTempVaultData({
        data: [],
      }),
    );

    let leftAmount = 100 - amount;

    for (let i = 0; i < roundNum; i++) {
      const claimTokenAllocation =
        i === 0
          ? 0
          : i === roundNum - 1
          ? truncNumber(leftAmount - acc, 2)
          : i < eachRound - 1 || i > eachEndRound - 1
          ? 0
          : truncNumber(leftAmount / (eachRoundLength - 1), 2);

      claimList.push({
        claimRound: i + 1,
        claimTime:
          i === roundNum - 1
            ? moment.unix(date1st).add(3, 'years').unix()
            : i === 0
            ? date1st
            : moment
                .unix(date1st)
                .add(i * Number(interval), 'days')
                .unix(),
        claimTokenAllocation:
          i === 0 ? 50 : Number(claimTokenAllocation.toFixed(3)),
      });
      acc += claimTokenAllocation;
    }

    dispatch(
      setClaimRoundTable({
        data: claimList,
      }),
    );
  }, [roundNum, date1st, interval, amount, eachRound, eachEndRound, dispatch]);

  useEffect(() => {
    const validation = [roundNum, date1st].map((value: number) => {
      return inputValidate(value);
    });

    setBtnDisable(validation.indexOf(true) !== -1);
    if (claimRoundTable?.length !== 0) {
      return setBtnDisable(true);
    }
  }, [
    roundNum,
    date1st,
    interval,
    amount,
    eachRound,
    eachEndRound,
    claimRoundTable,
  ]);

  return (
    <Flex flexDir={'column'} w={'100%'}>
      <Flex
        w={'100%'}
        h={'186px'}
        alignItems={'center'}
        flexDir={'column'}
        pt={'15px'}
        pl={'25px'}
        border={
          colorMode === 'light' ? '1px solid #e6eaee' : '1px solid #323232'
        }
        borderRadius={'10px'}
        mb={'10px'}
        justifyContent="center"
        fontSize={13}>
        <Flex mb={'20px'} w={'100%'}>
          <Flex alignItems={'center'} mr={'60px'}>
            <InputTitle
              title={'Number of Rounds'}
              isRequired={true}></InputTitle>
            <Flex pos={'relative'}>
              <Input
                ml={'12px'}
                w={'180px'}
                h={'32px'}
                border={'1px solid #dfe4ee'}
                borderRadius={'4px'}
                _focus={{}}
                fontSize={13}
                style={
                  roundNum !== 0 && roundNum < 3
                    ? {
                        border: '1px solid #ff3b3b',
                      }
                    : {}
                }
                onChange={(e: any) => onChange(e, setRoundnum)}></Input>
              {roundNum !== 0 && roundNum < 3 && (
                <Text
                  pos={'absolute'}
                  color={'#ff3b3b'}
                  fontSize={11}
                  w={'300px'}
                  top={'33px'}
                  left={'11px'}>
                  The number of vestings has to be greater than 3
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex alignItems={'center'} mr={'59px'}>
            <InputTitle
              title={'Date of 1st. Round'}
              isRequired={true}></InputTitle>
            <Flex
              ml={'20px'}
              w={'180px'}
              h={'32px'}
              border={
                colorMode === 'light'
                  ? '1px solid #dfe4ee'
                  : '1px solid #424242'
              }
              borderRadius={'4px'}
              alignItems="center"
              justifyContent={'flex-end'}
              pr={'10px'}>
              <Text>
                {date1st === 0 || date1st === undefined
                  ? ''
                  : convertTimeStamp(date1st, 'YYYY.MM.DD HH:mm:ss')}
              </Text>
              <Flex w={'20px'} h={'20px'} ml={'10px'}>
                <SingleCalendarPop
                  setDate={setDate1st}
                  startTimeCap={publicRound2End}></SingleCalendarPop>
              </Flex>
            </Flex>
          </Flex>
          <Flex alignItems={'center'}>
            <InputTitle title={'Interval'} isRequired={true}></InputTitle>
            <Box ml={'10px'}>
              <CustomSelectBox
                w={'180px'}
                h={'32px'}
                list={selectOptionValues}
                optionName={selectOptionNames}
                setValue={setInterval}
                fontSize={'12px'}></CustomSelectBox>
            </Box>
          </Flex>
        </Flex>
        <Flex justifyContent={'flex-start'} w={'100%'} mb={'20px'}>
          <Flex alignItems={'center'} mr={'60px'}>
            <Flex flexDir={'column'}>
              <InputTitle
                title={'Token Allocation'}
                style={{width: '109px'}}></InputTitle>
            </Flex>
            <Input
              ml={'20px'}
              w={'180px'}
              h={'32px'}
              border={'1px solid #dfe4ee'}
              borderRadius={'4px'}
              fontSize={13}
              _focus={{}}
              onChange={(e: any) => onChange(e, setAmount)}></Input>
          </Flex>
          <Flex alignItems={'center'}>
            <InputTitle title={'to Each Round'}></InputTitle>
            <Flex ml={'52px'}>
              <Input
                w={'80px'}
                h={'32px'}
                border={'1px solid #dfe4ee'}
                borderRadius={'4px'}
                fontSize={13}
                _focus={{}}
                onChange={(e: any) => onChange(e, setEachRound)}></Input>
              <Text textAlign={'center'} lineHeight={'32px'} mx={'6px'}>
                {' '}
                ~{' '}
              </Text>
              <Input
                w={'80px'}
                h={'32px'}
                border={'1px solid #dfe4ee'}
                borderRadius={'4px'}
                fontSize={13}
                _focus={{}}
                onChange={(e: any) => onChange(e, setEachEndRound)}></Input>
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <CustomButton
            text={'Autofill'}
            func={() => autoFill()}
            w={'100px'}
            h={'32px'}
            isDisabled={btnDisable}
            style={
              btnDisable
                ? {
                    bgColor: 'transparent',
                    border: '1px solid #e6eaee',
                    color: '#86929d',
                  }
                : {}
            }></CustomButton>
          {claimRoundTable && claimRoundTable.length > 0 && (
            <CustomButton
              text={'Clear All'}
              func={() => dispatch(setClaimRoundTable({data: []}))}
              w={'100px'}
              h={'32px'}
              style={{
                marginLeft: '10px',
                backgroundColor: '#257eee',
                color: 'white.100',
                fontWeight: 'normal',
              }}></CustomButton>
          )}
        </Flex>
      </Flex>
      <Flex w={'1030px'}>
        <Box
          d="flex"
          flexDir={'column'}
          textAlign="center"
          border={middleStyle.border}
          borderBottomWidth={0}
          lineHeight={'42px'}
          w={'1030px'}>
          <Flex
            h={'42px'}
            fontSize={12}
            color={colorMode === 'light' ? '#3d495d' : 'white.100'}
            fontWeight={600}
            borderBottom={
              colorMode === 'light' ? '1px solid #eff1f6' : '1px solid #373737'
            }>
            <Text w={'91px'}>Round</Text>
            <Text w={'314px'} borderX={middleStyle.border}>
              Date time
            </Text>
            <Text w={'314px'} borderRight={middleStyle.border}>
              Token Allocation (TON)
            </Text>
            <Text w={'314px'} borderRight={middleStyle.border}>
              Accumulated
            </Text>
          </Flex>
        </Box>
      </Flex>
      {/* {contentComponent} */}

      {claimRoundTable?.map((data: VaultSchedule, index: number) => {
        return (
          <VestingClaimRoundInput
            index={index}
            key={`${index}_${index}`}></VestingClaimRoundInput>
        );
      })}
    </Flex>
  );
};

export default VestingClaimRoundTable;
