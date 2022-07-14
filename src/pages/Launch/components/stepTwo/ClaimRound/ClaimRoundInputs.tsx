import {Flex, Input, Text, useColorMode, Box} from '@chakra-ui/react';
import SingleCalendarPop from '@Launch/components/common/SingleCalendarPop';
import {saveTempVaultData, selectLaunch} from '@Launch/launch.reducer';
import {Projects, VaultSchedule} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useToast} from 'hooks/useToast';
import moment from 'moment';
import {useCallback, useEffect, useMemo, useState} from 'react';
import commafy from 'utils/commafy';

const ClaimRoundInput = (props: {index: number}) => {
  const {index} = props;
  const {colorMode} = useColorMode();
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;

  const middleStyle = {
    border: colorMode === 'light' ? 'solid 1px #eff1f6' : 'solid 1px #373737',
  };

  const {
    data: {claimRoundTable, tempVaultData, selectedVaultIndex},
  } = useAppSelector(selectLaunch);
  const dispatch = useAppDispatch();
  const {toastMsg} = useToast();

  //legacy
  const [isErr, setIsErr] = useState(false);
  const [input, setInput] = useState(
    claimRoundTable !== undefined
      ? claimRoundTable[index].claimTokenAllocation
      : 0,
  );
  const [date, setDate] = useState(
    claimRoundTable !== undefined ? claimRoundTable[index].claimTime : 0,
  );

  const onBlurFunc = useCallback(() => {
    if (selectedVaultIndex !== undefined && claimRoundTable !== undefined) {
      const vaultTokenAllocation =
        vaultsList[selectedVaultIndex].vaultTokenAllocation;

      const totalTokenInputs = claimRoundTable.reduce(
        (prev: number, cur: VaultSchedule, currentIndex: number) => {
          if (cur.claimTokenAllocation && currentIndex <= index) {
            const tempData = tempVaultData.filter((data: VaultSchedule) => {
              if (data.claimRound === cur.claimRound) {
                return data.claimRound;
              }
            });
            if (tempData.length > 0) {
              return prev + tempData[0].claimTokenAllocation;
            }
            return prev + cur.claimTokenAllocation;
          } else {
            return prev;
          }
        },
        0,
      );

      if (totalTokenInputs > vaultTokenAllocation) {
        setIsErr(true);
        return toastMsg({
          title: 'Token Allocation to this vault is not enough',
          description:
            'You have to put more token or adjust token allocation for claim rounds',
          duration: 2000,
          isClosable: true,
          status: 'error',
        });
      }
    }

    const newData = {
      claimRound: index + 1,
      claimTime: date,
      claimTokenAllocation: Number(input),
    };

    const tempData =
      tempVaultData.length > 0
        ? tempVaultData.filter((data: VaultSchedule) => {
            if (data.claimRound) return data.claimRound !== newData.claimRound;
          })
        : [];

    dispatch(
      saveTempVaultData({
        data: tempVaultData.length > 0 ? [...tempData, newData] : [newData],
      }),
    );
  }, [
    input,
    date,
    claimRoundTable,
    selectedVaultIndex,
    dispatch,
    index,
    tempVaultData,
    vaultsList,
  ]);

  useEffect(() => {
    onBlurFunc();
  }, [date]);

  const onChange = (e: any) => {
    const {value} = e.target;
    if (isNaN(value)) {
      return;
    }
    setInput(Number(value));
  };

  const component = useMemo(() => {
    if (claimRoundTable === undefined) {
      return null;
    }
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
                ? index % 2 !== 0
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
                {date === undefined
                  ? '-'
                  : moment.unix(date as number).format('YYYY.MM.DD HH:mm:ss')}
              </Text>
              <SingleCalendarPop
                //@ts-ignore
                startTimeCap={
                  index === 0
                    ? //@ts-ignore
                      vaultsList[0].publicRound2End ||
                      moment().add(9, 'days').unix()
                    : (claimRoundTable !== undefined &&
                        Number(claimRoundTable[index - 1]?.claimTime)) ||
                      0
                }
                setDate={setDate}></SingleCalendarPop>
            </Flex>
            <Flex
              w={'314px'}
              alignItems="center"
              justifyContent={'center'}
              borderRight={middleStyle.border}
              borderBottom={middleStyle.border}>
              <Flex
                w={'161px'}
                h={'32px'}
                border={
                  colorMode === 'light'
                    ? 'solid 1px #dfe4ee'
                    : '1px solid #424242'
                }
                borderRadius={4}
                _hover={{
                  borderWidth: '1px',
                  borderColor: '#257eee',
                }}
                _focus={
                  isErr ? {} : {borderWidth: '1px', borderColor: '#257eee'}
                }>
                <Input
                  // ref={(el) => (inputRefs.current[index] = el)}

                  w={'100%'}
                  h={'100%'}
                  fontSize={12}
                  placeholder={''}
                  borderRadius={0}
                  borderWidth={0}
                  textAlign={'center'}
                  value={input}
                  onBlur={onBlurFunc}
                  onChange={onChange}></Input>
              </Flex>
            </Flex>
            <Text
              w={'314px'}
              borderRight={middleStyle.border}
              borderBottom={middleStyle.border}>
              {commafy(
                claimRoundTable.reduce(
                  (prev: number, cur: VaultSchedule, currentIndex: number) => {
                    if (cur.claimTokenAllocation && currentIndex <= index) {
                      const tempData = tempVaultData.filter(
                        (data: VaultSchedule) => {
                          if (data.claimRound === cur.claimRound) {
                            return data.claimRound;
                          }
                        },
                      );
                      if (tempData.length > 0) {
                        return prev + tempData[0].claimTokenAllocation;
                      }
                      return prev + cur.claimTokenAllocation;
                    } else {
                      return prev;
                    }
                  },
                  0,
                ),
              )}
            </Text>
          </Flex>
        </Box>
      </Flex>
    );
  }, [input, claimRoundTable, vaultsList, date, tempVaultData]);

  if (claimRoundTable === undefined) {
    return null;
  }

  return <>{component}</>;
};

export default ClaimRoundInput;
