import {Box, Flex, Input, Text, useColorMode, useTheme} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import HoverImage from 'components/HoverImage';
import {useFormikContext, FastField} from 'formik';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import PlusIconNormal from 'assets/launch/plus-icon-normal.svg';
import PlusIconHover from 'assets/launch/plus-icon-hover.svg';
import MinusIconNormal from 'assets/launch/minus-icon-normal.svg';
import MinusIconHover from 'assets/launch/minus-icon-hover.svg';
import {CustomButton} from 'components/Basic/CustomButton';
import {CustomSelectBox} from 'components/Basic';
import {Projects, VaultAny, VaultSchedule} from '@Launch/types';
import moment from 'moment';
import {selectLaunch} from '@Launch/launch.reducer';
import {useAppSelector} from 'hooks/useRedux';
import SingleCalendarPop from '../common/SingleCalendarPop';
import commafy from 'utils/commafy';
import {useToast} from 'hooks/useToast';
import {CustomTooltip} from 'components/Tooltip';

type ClaimRoundTable = {
  dateTime: number;
  tokenAllocation: number;
};

const defaultTableData = {
  claimRound: 1,
  claimTime: undefined,
  claimTokenAllocation: undefined,
};

const ClaimRound = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();

  const {
    data: {selectedVault},
  } = useAppSelector(selectLaunch);
  const [selectedVaultDetail, setSelectedVaultDetail] = useState([]);
  const vaultsList = values.vaults;

  const middleStyle = {
    border: colorMode === 'light' ? 'solid 1px #eff1f6' : 'solid 1px #373737',
  };

  useEffect(() => {
    vaultsList.filter((vaultData: VaultAny) => {
      if (vaultData.vaultName === selectedVault) {
        //@ts-ignore
        return setSelectedVaultDetail(vaultData);
      }
    });
  }, [selectedVault, vaultsList]);

  const [selectedDay, setSelectedDay] = useState<'14' | '30' | '60'>('14');
  const selectOptionValues = ['14', '30', '60'];
  const selectOptionNames = ['14 Days', '30 Days', '60 Days'];

  const [inputVals, setInputVals] = useState<undefined | VaultSchedule[]>(
    undefined,
  );
  const {toastMsg} = useToast();
  const inputRefs = useRef<any[]>([]);

  //@ts-ignore
  const {claim} = selectedVaultDetail;

  const addRow = useCallback(() => {
    if (selectedVaultDetail) {
      //@ts-ignore
      return setFieldValue(`vaults[${selectedVaultDetail.index}].claim`, [
        ...claim,
        defaultTableData,
      ]);
    }
    /*eslint-disable*/
  }, [claim, selectedVaultDetail]);

  const removeRow = useCallback(
    (rowIndex) => {
      if (selectedVaultDetail) {
        const newTableData = claim.filter(
          (data: ClaimRoundTable, index: number) => {
            return index !== rowIndex;
          },
        );
        return setFieldValue(
          //@ts-ignore
          `vaults[${selectedVaultDetail.index}].claim`,
          newTableData,
        );
      }
    },
    [claim, selectedVaultDetail],
  );

  const setDate = useCallback(() => {
    const claimValue: VaultSchedule[] = claim.map(
      (data: VaultSchedule, index: number) => {
        //@ts-ignore
        const refTimeStamp = selectedVaultDetail.claim[0].claimTime;
        if (refTimeStamp === undefined) {
          return toastMsg({
            status: 'error',
            title: 'Date Time Error',
            description: 'First date time must be filled out',
            duration: 3000,
            isClosable: true,
          });
        }
        const nowTimeStamp =
          index === 0
            ? refTimeStamp
            : moment
                .unix(refTimeStamp)
                .add(index * Number(selectedDay), 'days')
                .unix();
        return {
          claimRound: index + 1,
          claimTime: nowTimeStamp,
          claimTokenAllocation: data.claimTokenAllocation,
        };
      },
    );

    if (selectedVaultDetail) {
      // setTableData(claimValue);
      return setFieldValue(
        //@ts-ignore
        `vaults[${selectedVaultDetail.index}].claim`,
        claimValue,
      );
    }
    /*eslint-disable*/
  }, [claim, selectedDay, selectedVaultDetail]);

  // const [test, setTest] = useState(true);

  useEffect(() => {
    if (claim) {
      setInputVals(claim);
      // setTest(false);
    }
  }, [claim, selectedVaultDetail]);

  useEffect(() => {
    const errBorderStyle = '1px solid #ff3b3b';
    const noErrBorderStyle =
      colorMode === 'light' ? '1px solid #dfe4ee' : '1px solid #373737';
    //@ts-ignore
    const vaultTokenAllocation = selectedVaultDetail.vaultTokenAllocation;
    const totalTokenInputs = inputRefs.current.reduce((acc, cur) => {
      if (cur) {
        return acc + Number(cur.value);
      }
    }, 0);
    if (totalTokenInputs > vaultTokenAllocation) {
      inputRefs.current.map((input: any) => {
        input.style.border = errBorderStyle;
      });
      toastMsg({
        title: 'Token Allocation to this vault is not enough',
        description:
          'You have to put more token or adjust token allocation for claim rounds',
        duration: 2000,
        isClosable: true,
        status: 'error',
      });
    } else {
      inputRefs.current.map((input: any) => {
        if (input) {
          input.style.border = noErrBorderStyle;
        }
      });
    }
  }, [inputRefs, inputVals]);

  let tokenAcc = 0;

  return (
    <Flex flexDir={'column'}>
      <Box
        mb={'15px'}
        d="flex"
        justifyContent={'space-between'}
        alignItems="center">
        <Flex>
          <StepTitle title={'Claim Round'} fontSize={16}></StepTitle>
          <Flex ml={'5px'}>
            <CustomTooltip
              msg={[
                'The sum of public round 1 and 2 must equal',
                'the value of total token allocation.',
              ]}
              toolTipH={'44px'}
              toolTipW={254}></CustomTooltip>
          </Flex>
        </Flex>
        <Flex>
          <Text
            fontSize={13}
            color={colorMode === 'light' ? '#304156' : 'white.100'}
            mr={'15px'}
            textAlign="center"
            lineHeight={'35px'}>
            Interval
          </Text>
          <CustomSelectBox
            w={'100px'}
            h={'32px'}
            list={selectOptionValues}
            optionName={selectOptionNames}
            setValue={setSelectedDay}
            fontSize={'12px'}></CustomSelectBox>
          <CustomButton
            style={{marginLeft: '10px'}}
            w={'100px'}
            h={'32px'}
            text={'Set All'}
            //@ts-ignore
            // isDisabled={
            //   selectedVaultDetail.claim[0].claimTime !== undefined && selectedVaultDetail
            //     .claim[0].claimTime === undefined
            // }
            func={() => setDate()}></CustomButton>
        </Flex>
      </Box>
      <Flex>
        <Box
          d="flex"
          flexDir={'column'}
          textAlign="center"
          border={middleStyle.border}
          lineHeight={'42px'}>
          <Flex
            h={'42px'}
            fontSize={12}
            color={colorMode === 'light' ? '#3d495d' : 'white.100'}
            fontWeight={600}
            borderBottom={
              colorMode === 'light' ? '1px solid #eff1f6' : '1px solid #373737'
            }>
            <Text w={'90px'}>Claim</Text>
            <Text w={'292px'} borderX={middleStyle.border}>
              Date time
            </Text>
            <Text w={'281px'} borderRight={middleStyle.border}>
              Token Allocation
            </Text>
            <Text w={'281px'} borderRight={middleStyle.border}>
              Accumulated
            </Text>
            <Text w={'90px'}>Function</Text>
          </Flex>
          {
            //@ts-ignore
            selectedVaultDetail.vaultType === 'Initial Liquidity' ||
            //@ts-ignore
            selectedVaultDetail.vaultType === 'DAO' ? (
              <Flex
                w={'100%'}
                borderTop={middleStyle.border}
                alignItems="center"
                justifyContent={'center'}>
                <Text fontSize={13} color={'#808992'} fontWeight={600}>
                  There is no Claim value.
                </Text>
              </Flex>
            ) : (
              claim?.map((data: VaultSchedule, index: number) => {
                return (
                  <Flex
                    h={'42px'}
                    fontSize={12}
                    color={colorMode === 'light' ? '#3d495d' : 'white.100'}
                    fontWeight={600}>
                    <Text w={'90px'}>
                      {index > 8 ? `${index + 1}` : `0${index + 1}`}
                    </Text>
                    <Flex
                      w={'292px'}
                      borderX={middleStyle.border}
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
                        fieldValueKey={`vaults[${selectedVaultDetail.index}].claim[${index}]`}
                        oldValues={data}
                        valueKey={'claimTime'}></SingleCalendarPop>
                    </Flex>
                    <Text w={'281px'} borderRight={middleStyle.border}>
                      <Input
                        w={`120px`}
                        h={`32px`}
                        ref={(el) => (inputRefs.current[index] = el)}
                        _focus={{}}
                        fontSize={12}
                        placeholder={''}
                        textAlign={'center'}
                        value={
                          inputVals !== undefined &&
                          inputVals[index]?.claimTokenAllocation !== undefined
                            ? inputVals[index].claimTokenAllocation
                            : ''
                        }
                        onBlur={(e) => {
                          const {value} = e.target;
                          return setFieldValue(
                            //@ts-ignore
                            `vaults[${selectedVaultDetail.index}].claim[${index}]`,
                            {
                              ...data,
                              claimTokenAllocation: Number(value),
                            },
                          );
                        }}
                        onChange={(e) => {
                          const {value} = e.target;
                          if (inputVals) {
                            let oldVals = [...inputVals];
                            let item = {
                              ...oldVals[index],
                              claimTokenAllocation: Number(value),
                            };
                            oldVals[index] = item;
                            return setInputVals(oldVals);
                          }
                        }}></Input>
                    </Text>
                    <Text w={'281px'} borderRight={middleStyle.border}>
                      {data.claimTokenAllocation === undefined
                        ? '-'
                        : commafy((tokenAcc += data.claimTokenAllocation))}
                    </Text>
                    <Flex
                      w={'90px'}
                      alignItems="center"
                      justifyContent="center">
                      {index === 0 && claim.length === 1 ? (
                        <Flex
                          w={'24px'}
                          h={'24px'}
                          alignItems="center"
                          justifyContent="center"
                          border={
                            colorMode === 'light'
                              ? '1px solid #e6eaee'
                              : '1px solid #373737'
                          }
                          bg={colorMode === 'light' ? 'white.100' : 'none'}>
                          <HoverImage
                            action={() => addRow()}
                            img={PlusIconNormal}
                            hoverImg={PlusIconHover}></HoverImage>
                        </Flex>
                      ) : index === 0 && claim.length > 1 ? (
                        <div></div>
                      ) : index + 1 !== claim.length ? (
                        <Flex
                          w={'24px'}
                          h={'24px'}
                          alignItems="center"
                          justifyContent="center"
                          border={
                            colorMode === 'light'
                              ? '1px solid #e6eaee'
                              : '1px solid #373737'
                          }
                          bg={colorMode === 'light' ? 'white.100' : 'none'}>
                          <HoverImage
                            action={() => removeRow(index)}
                            img={MinusIconNormal}
                            hoverImg={MinusIconHover}></HoverImage>
                        </Flex>
                      ) : (
                        <>
                          <Flex
                            w={'24px'}
                            h={'24px'}
                            alignItems="center"
                            justifyContent="center"
                            border={
                              colorMode === 'light'
                                ? '1px solid #e6eaee'
                                : '1px solid #373737'
                            }
                            bg={colorMode === 'light' ? 'white.100' : 'none'}
                            mr={'10px'}>
                            <HoverImage
                              action={() => removeRow(index)}
                              img={MinusIconNormal}
                              hoverImg={MinusIconHover}></HoverImage>
                          </Flex>
                          <Flex
                            w={'24px'}
                            h={'24px'}
                            alignItems="center"
                            justifyContent="center"
                            border={
                              colorMode === 'light'
                                ? '1px solid #e6eaee'
                                : '1px solid #373737'
                            }
                            bg={colorMode === 'light' ? 'white.100' : 'none'}>
                            <HoverImage
                              action={() => addRow()}
                              img={PlusIconNormal}
                              hoverImg={PlusIconHover}></HoverImage>
                          </Flex>
                        </>
                      )}
                    </Flex>
                  </Flex>
                );
              })
            )
          }
        </Box>
      </Flex>
    </Flex>
  );
};

export default ClaimRound;
