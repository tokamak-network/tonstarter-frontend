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
import {
  saveTempVaultData,
  selectLaunch,
  setClaimRoundTable,
} from '@Launch/launch.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
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
    data: {selectedVault, claimRoundTable, tempVaultData},
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

  // const [selectedDay, setSelectedDay] = useState<'14' | '30' | '60'>('14');

  // const [inputVals, setInputVals] = useState<undefined | VaultSchedule[]>(
  //   undefined,
  // );
  const {toastMsg} = useToast();
  const inputRefs = useRef<any[]>([]);

  const [claimInfo, setClaimInfo] = useState<any>();

  const dispatch = useAppDispatch();

  //@ts-ignore
  const {claim} = selectedVaultDetail;

  // const setDate = useCallback(() => {
  //   const claimValue: VaultSchedule[] = claim.map(
  //     (data: VaultSchedule, index: number) => {
  //       //@ts-ignore
  //       const refTimeStamp = selectedVaultDetail.claim[0].claimTime;
  //       if (refTimeStamp === undefined) {
  //         return toastMsg({
  //           status: 'error',
  //           title: 'Date Time Error',
  //           description: 'First date time must be filled out',
  //           duration: 3000,
  //           isClosable: true,
  //         });
  //       }
  //       const nowTimeStamp =
  //         index === 0
  //           ? refTimeStamp
  //           : moment
  //               .unix(refTimeStamp)
  //               .add(index * Number(selectedDay), 'days')
  //               .unix();
  //       return {
  //         claimRound: index + 1,
  //         claimTime: nowTimeStamp,
  //         claimTokenAllocation: data.claimTokenAllocation,
  //       };
  //     },
  //   );

  const [claimRoundEdit, setClaimRoundEdit] = useState(false);

  // useEffect(() => {
  //   const errBorderStyle = '1px solid #ff3b3b';
  //   const noErrBorderStyle = colorMode === 'light' ? null : null;
  //   //@ts-ignore
  //   const vaultTokenAllocation = selectedVaultDetail.vaultTokenAllocation;
  //   const totalTokenInputs = inputRefs.current.reduce((acc, cur) => {
  //     if (cur) {
  //       return acc + Number(cur.value);
  //     }
  //   }, 0);
  //   if (totalTokenInputs > vaultTokenAllocation) {
  //     inputRefs.current.map((input: any) => {
  //       input.style.border = errBorderStyle;
  //     });
  //     setIsErr(true);
  //     toastMsg({
  //       title: 'Token Allocation to this vault is not enough',
  //       description:
  //         'You have to put more token or adjust token allocation for claim rounds',
  //       duration: 2000,
  //       isClosable: true,
  //       status: 'error',
  //     });
  //   } else {
  //     inputRefs.current.map((input: any) => {
  //       if (input) {
  //         input.style.border = noErrBorderStyle;
  //       }
  //     });
  //     setIsErr(false);
  //   }
  // }, [inputRefs, inputVals]);

  const saveConfirm = useCallback(() => {
    if (claimRoundTable && tempVaultData) {
      const data = claimRoundTable.map((claimData: VaultSchedule) => {
        const isExist = tempVaultData.map((tempData: VaultSchedule) => {
          if (tempData.claimRound === claimData.claimRound) {
            return tempData;
          }
        });
        return isExist[0] === undefined ? claimData : isExist[0];
      });
      //@ts-ignore
      setFieldValue(`vaults.${selectedVaultDetail.index}.claim`, data);
    }
  }, [claimRoundTable, tempVaultData, selectedVaultDetail]);

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
              func={() => {
                dispatch(
                  saveTempVaultData({
                    data: [],
                  }),
                );
                dispatch(
                  setClaimRoundTable({
                    //@ts-ignore
                    data: selectedVaultDetail.claim,
                  }),
                );
                setClaimRoundEdit(true);
              }}
              h="32px"
              w="100px"
              isDisabled={
                //@ts-ignore
                selectedVaultDetail.vaultTokenAllocation === 0 ||
                //@ts-ignore
                selectedVaultDetail.vaultType === 'Initial Liquidity' ||
                //@ts-ignore
                selectedVaultDetail.vaultType === 'DAO'
              }></CustomButton>
          </Flex>
        ) : (
          <Flex fontSize={13}>
            <CustomButton
              text="Confirm"
              func={() => {
                saveConfirm();
                setClaimRoundEdit(false);
              }}
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
              (selectedVaultDetail.vaultType === 'Initial Liquidity' ||
                //@ts-ignore
                selectedVaultDetail.vaultType === 'DAO' ||
                claim === undefined ||
                claim.length === 0) &&
              claimRoundEdit === false ? (
                <Flex
                  w={'100%'}
                  borderBottom={middleStyle.border}
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
                      </Flex>
                      <Flex
                        w={'314px'}
                        alignItems="center"
                        justifyContent={'center'}
                        borderRight={middleStyle.border}
                        borderBottom={middleStyle.border}>
                        <Text>{data.claimTokenAllocation}</Text>
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
