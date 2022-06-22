import {
  Box,
  Flex,
  Input,
  InputGroup,
  Text,
  useColorMode,
  useTheme,
} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import HoverImage from 'components/HoverImage';
import {useFormikContext} from 'formik';
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
import '@Launch/components/css/claimRound.css';
import ClaimRoundTable from './ClaimRoundTable';

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
  const testRef = useRef<any[]>([]);

  const [claimInfo, setClaimInfo] = useState<any>();

  //@ts-ignore
  const {claim} = selectedVaultDetail;

  useEffect(() => {
    setClaimInfo(claim);
  }, [claim, selectedVaultDetail]);

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

  const add10Row = useCallback(() => {
    if (selectedVaultDetail) {
      //@ts-ignore
      return setFieldValue(`vaults[${selectedVaultDetail.index}].claim`, [
        ...claim,
        defaultTableData,
        defaultTableData,
        defaultTableData,
        defaultTableData,
        defaultTableData,
        defaultTableData,
        defaultTableData,
        defaultTableData,
        defaultTableData,
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

  const setAmount = useCallback(() => {
    const claimValue: VaultSchedule[] = claim.map(
      (data: VaultSchedule, index: number) => {
        //@ts-ignore
        const test = selectedVaultDetail.vaultTokenAllocation / claim.length;
        let result;
        if (test.toString().split('.')[1]) {
          result =
            test.toString().split('.')[0] +
            '.' +
            test.toString().split('.')[1].slice(0, 2);
        } else {
          result = test;
        }

        return {
          claimRound: index + 1,
          claimTime: data.claimTime,
          claimTokenAllocation:
            //@ts-ignore
            Number(result),
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

  useEffect(() => {
    if (claim) {
      setInputVals(claim);
      // setTest(false);
    }
  }, [claim, selectedVaultDetail]);

  const [isErr, setIsErr] = useState(false);
  const [claimRoundEdit, setClaimRoundEdit] = useState(false);

  useEffect(() => {
    const errBorderStyle = '1px solid #ff3b3b';
    const noErrBorderStyle = colorMode === 'light' ? null : null;
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
      setIsErr(true);
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
      setIsErr(false);
    }
  }, [inputRefs, inputVals]);

  let tokenAcc = 0;

  return (
    <Flex flexDir={'column'} w={'100%'}>
      <Box
        mb={'15px'}
        d="flex"
        justifyContent={'space-between'}
        alignItems="center">
        <Flex w={'100%'}>
          <StepTitle title={'Claim Round'} fontSize={16}></StepTitle>
          <Flex ml={'5px'}>
            <CustomTooltip
              msg={[
                'The sum of public round 1 and 2 must equal',
                'the value of total token allocation.',
              ]}
              toolTipH={'46px'}
              toolTipW={270}></CustomTooltip>
          </Flex>
        </Flex>
        {claimRoundEdit === false ? (
          <Flex fontSize={13}>
            <CustomButton
              text="Edit"
              func={() => setClaimRoundEdit(true)}
              h="32px"
              w="100px"></CustomButton>
          </Flex>
        ) : (
          <Flex fontSize={13}>
            <CustomButton
              text="Confirm"
              func={() => setClaimRoundEdit(false)}
              h="32px"
              w="100px"
              style={{marginRight: '10px'}}></CustomButton>
            <CustomButton
              text="Cancel"
              func={() => setClaimRoundEdit(false)}
              h="32px"
              w="100px"
              style={{
                color: '#3a495f',
                backgroundColor: '#e9edf1',
              }}></CustomButton>
          </Flex>
        )}
      </Box>
      {claimRoundEdit === true && <ClaimRoundTable></ClaimRoundTable>}
      {claimRoundEdit === false && (
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
                colorMode === 'light'
                  ? '1px solid #eff1f6'
                  : '1px solid #373737'
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
            {
              //@ts-ignore
              selectedVaultDetail.vaultType === 'Initial Liquidity' ||
              //@ts-ignore
              (selectedVaultDetail.vaultType === 'DAO' && claimEdit) ? (
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
                          color={
                            colorMode === 'light' ? '#3d495d' : 'white.100'
                          }
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
                          valueKey={'claimTime'}
                          startTimeCap={
                            index === 0
                              ? //@ts-ignore
                                vaultsList[0].publicRound2End ||
                                moment().add(9, 'days').unix()
                              : (claimInfo !== undefined &&
                                  Number(claimInfo[index - 1]?.claimTime)) ||
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
                              inputVals !== undefined &&
                              inputVals[index]?.claimTokenAllocation !==
                                undefined
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

                              if (isNaN(Number(value))) {
                                return;
                              }

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
                  );
                })
              )
            }
          </Box>
        </Flex>
      )}
    </Flex>
  );
};

export default ClaimRound;
