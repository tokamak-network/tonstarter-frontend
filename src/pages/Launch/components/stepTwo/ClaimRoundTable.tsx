import {
  Box,
  Flex,
  Input,
  InputGroup,
  Select,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import {selectLaunch, setClaimRoundTable} from '@Launch/launch.reducer';
import {Projects, VaultSchedule} from '@Launch/types';
import {CustomSelectBox} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {index} from 'd3';
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
import SingleCalendarPop from '../common/SingleCalendarPop';
import ClaimRoundInput from './ClaimRound/ClaimRoundInputs';

const selectOptionValues = ['14', '30', '60'];
const selectOptionNames = ['14 Days', '30 Days', '60 Days'];

const InputTitle = (props: {title: string}) => {
  const {title} = props;
  return (
    <Text
      fontSize={13}
      color={'#2d3136'}
      w={title !== 'Interval' ? '109px' : '44px'}>
      {title}
    </Text>
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

const ClaimRoundTable = () => {
  const {colorMode} = useColorMode();
  const [roundNum, setRoundnum] = useState<number>(0);
  const [date1st, setDate1st] = useState<number>(0);
  const [interval, setInterval] = useState<'14' | '30' | '60'>('14');
  const [amount, setAmount] = useState<number>(0);
  const [eachRound, setEachRound] = useState<number>(0);
  const [eachEndRound, setEachEndRound] = useState<number>(0);

  const [btnDisable, setBtnDisable] = useState<boolean>(true);

  const middleStyle = {
    border: colorMode === 'light' ? 'solid 1px #eff1f6' : 'solid 1px #373737',
  };

  const {
    data: {claimRoundTable},
  } = useAppSelector(selectLaunch);
  const dispatch = useAppDispatch();
  const {values} = useFormikContext<Projects['CreateProject']>();

  const vaultsList = values.vaults;

  const autoFill = useCallback(() => {
    const claimList: VaultSchedule[] = [];
    const eachRoundLength = eachEndRound - eachRound + 1;

    for (let i = 0; i < roundNum; i++) {
      claimList.push({
        claimRound: i + 1,
        claimTime:
          i === 0
            ? date1st
            : moment
                .unix(date1st)
                .add(i * Number(interval), 'days')
                .unix(),
        claimTokenAllocation:
          i < eachRound - 1 || i > eachEndRound - 1
            ? 0
            : amount / eachRoundLength,
      });
    }

    dispatch(
      setClaimRoundTable({
        data: claimList,
      }),
    );
  }, [roundNum, date1st, interval, amount, eachRound, eachEndRound, dispatch]);

  useEffect(() => {
    const validation = [roundNum, date1st, amount, eachRound, eachEndRound].map(
      (value: number) => {
        return inputValidate(value);
      },
    );
    setBtnDisable(validation.indexOf(true) !== -1);
  }, [roundNum, date1st, interval, amount, eachRound, eachEndRound]);

  console.log('--');
  console.log([claimRoundTable]);

  let tokenAcc = 0;

  const contentComponent = useMemo(() => {
    if (claimRoundTable) {
      return claimRoundTable.map((data: VaultSchedule, index: number) => {
        return (
          <Flex w={'100%'}>
            <Box
              d="flex"
              flexDir={'column'}
              textAlign="center"
              border={middleStyle.border}
              borderBottomWidth={0}
              lineHeight={'42px'}>
              <Flex
                h={'42px'}
                fontSize={12}
                color={colorMode === 'light' ? '#3d495d' : 'white.100'}
                fontWeight={600}
                bg={
                  colorMode === 'light'
                    ? index % 2 === 0
                      ? 'none'
                      : '#fafbfc'
                    : 'none'
                }>
                <Text w={'91px'} borderBottom={middleStyle.border}>
                  {index > 8 ? `${index + 1}` : `0${index + 1}`}
                </Text>
                <Flex
                  w={'314px'}
                  borderX={middleStyle.border}
                  borderBottom={middleStyle.border}
                  alignItems="center"
                  justifyContent={'center'}>
                  <Text
                    mr={'5px'}
                    color={colorMode === 'light' ? '#3d495d' : 'white.100'}
                    fontSize={11}>
                    {data.claimTime === undefined
                      ? '-'
                      : moment
                          .unix(data.claimTime)
                          .format('YYYY.MM.DD HH:mm:ss')}
                  </Text>
                  <SingleCalendarPop
                    //@ts-ignore
                    oldValues={data}
                    valueKey={'claimTime'}
                    startTimeCap={
                      index === 0
                        ? //@ts-ignore
                          vaultsList[0].publicRound2End ||
                          moment().add(9, 'days').unix()
                        : (claimRoundTable !== undefined &&
                            Number(claimRoundTable[index - 1]?.claimTime)) ||
                          0
                    }></SingleCalendarPop>
                </Flex>

                <Text
                  w={'314px'}
                  borderRight={middleStyle.border}
                  borderBottom={middleStyle.border}>
                  {data.claimTokenAllocation === undefined
                    ? '-'
                    : commafy((tokenAcc += data.claimTokenAllocation))}
                </Text>
              </Flex>
            </Box>
          </Flex>
        );
      });
    }
    return <></>;
  }, [claimRoundTable]);

  return (
    <Flex flexDir={'column'} w={'100%'}>
      <Flex
        w={'100%'}
        h={'186px'}
        alignItems={'center'}
        flexDir={'column'}
        pt={'15px'}
        pl={'25px'}
        border={'1px solid #e6eaee'}
        borderRadius={'10px'}
        mb={'10px'}
        justifyContent="center"
        fontSize={13}>
        <Flex mb={'20px'} w={'100%'}>
          <Flex alignItems={'center'} mr={'60px'}>
            <InputTitle title={'Number of Rounds'}></InputTitle>
            <Input
              ml={'20px'}
              w={'180px'}
              h={'32px'}
              border={'1px solid #dfe4ee'}
              borderRadius={'4px'}
              _focus={{}}
              fontSize={13}
              onChange={(e: any) => onChange(e, setRoundnum)}></Input>
          </Flex>
          <Flex alignItems={'center'} mr={'59px'}>
            <InputTitle title={'Date of 1st. Round'}></InputTitle>
            <Flex
              ml={'20px'}
              w={'180px'}
              h={'32px'}
              border={'1px solid #dfe4ee'}
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
                <SingleCalendarPop setDate={setDate1st}></SingleCalendarPop>
              </Flex>
            </Flex>
          </Flex>
          <Flex alignItems={'center'}>
            <InputTitle title={'Interval'}></InputTitle>
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
            <InputTitle title={'Amount'}></InputTitle>
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
            <Flex ml={'20px'}>
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
            isDisabled={btnDisable}></CustomButton>
        </Flex>
      </Flex>
      <Flex w={'100%'}>
        <Box
          d="flex"
          flexDir={'column'}
          textAlign="center"
          border={middleStyle.border}
          borderBottomWidth={0}
          lineHeight={'42px'}>
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
              Token Allocation ({values.tokenSymbol})
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
          <ClaimRoundInput
            index={index}
            key={`${index}_${index}`}></ClaimRoundInput>
        );
      })}

      {/* {claimRoundTable?.map((data: VaultSchedule, index: number) => {
        return (
          <Flex w={'100%'}>
            <Box
              d="flex"
              flexDir={'column'}
              textAlign="center"
              border={middleStyle.border}
              borderBottomWidth={0}
              lineHeight={'42px'}>
              <Flex
                h={'42px'}
                fontSize={12}
                color={colorMode === 'light' ? '#3d495d' : 'white.100'}
                fontWeight={600}
                bg={
                  colorMode === 'light'
                    ? index % 2 === 0
                      ? 'none'
                      : '#fafbfc'
                    : 'none'
                }>
                <Text w={'91px'} borderBottom={middleStyle.border}>
                  {index > 8 ? `${index + 1}` : `0${index + 1}`}
                </Text>
                <Flex
                  w={'314px'}
                  borderX={middleStyle.border}
                  borderBottom={middleStyle.border}
                  alignItems="center"
                  justifyContent={'center'}>
                  <Text
                    mr={'5px'}
                    color={colorMode === 'light' ? '#3d495d' : 'white.100'}
                    fontSize={11}>
                    {data.claimTime === undefined
                      ? '-'
                      : moment
                          .unix(data.claimTime)
                          .format('YYYY.MM.DD HH:mm:ss')}
                  </Text>
                  <SingleCalendarPop
                    //@ts-ignore
                    oldValues={data}
                    valueKey={'claimTime'}
                    startTimeCap={
                      index === 0
                        ? //@ts-ignore
                          vaultsList[0].publicRound2End ||
                          moment().add(9, 'days').unix()
                        : (claimRoundTable !== undefined &&
                            Number(claimRoundTable[index - 1]?.claimTime)) ||
                          0
                    }></SingleCalendarPop>
                </Flex>
                <Flex
                  w={'314px'}
                  alignItems="center"
                  justifyContent={'center'}
                  borderRight={middleStyle.border}
                  borderBottom={middleStyle.border}>
                  <InputGroup>
                    <Input
                      h={`42px`}
                      // ref={(el) => (inputRefs.current[index] = el)}
                      _hover={{
                        borderWidth: '1px',
                        borderColor: '#257eee',
                      }}
                      _focus={
                        isErr
                          ? {}
                          : {borderWidth: '1px', borderColor: '#257eee'}
                      }
                      fontSize={12}
                      placeholder={''}
                      borderRadius={0}
                      borderWidth={0}
                      textAlign={'center'}
                      value={
                        claimRoundTable !== undefined &&
                        claimRoundTable[index]?.claimTokenAllocation !==
                          undefined
                          ? claimRoundTable[index].claimTokenAllocation
                          : ''
                      }
                      onBlur={(e) => {
                        const {value} = e.target;
                      }}
                      onChange={(e) => {
                        const {value} = e.target;

                        if (isNaN(Number(value)) || value === undefined) {
                          return;
                        }

                        console.log(claimRoundTable);

                        const claimData = claimRoundTable
                          .splice(index, 1)
                          .splice(index, 0, {
                            claimRound: index + 1,
                            claimTime: 1,
                            claimTokenAllocation: Number(value),
                          });

                        dispatch(
                          setClaimRoundTable({
                            data: {
                              claimRoundTable: claimData,
                            },
                          }),
                        );

                        // if (inputVals) {
                        //   let oldVals = [...inputVals];
                        //   let item = {
                        //     ...oldVals[index],
                        //     claimTokenAllocation: Number(value),
                        //   };
                        //   oldVals[index] = item;
                        //   return setInputVals(oldVals);
                        // }
                      }}></Input>
                  </InputGroup>
                </Flex>
                <Text
                  w={'314px'}
                  borderRight={middleStyle.border}
                  borderBottom={middleStyle.border}>
                  {data.claimTokenAllocation === undefined
                    ? '-'
                    : commafy((tokenAcc += data.claimTokenAllocation))}
                </Text>
              </Flex>
            </Box>
          </Flex>
        );
      })} */}
    </Flex>
  );
};

export default ClaimRoundTable;
