import {Box, Flex, Input, Text, useColorMode, useTheme} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import HoverImage from 'components/HoverImage';
import {useFormikContext} from 'formik';
import {useCallback, useEffect, useState} from 'react';
import CalendarActiveImg from 'assets/launch/calendar-active-icon.svg';
import CalendarInactiveImg from 'assets/launch/calendar-inactive-icon.svg';
import PlusIconNormal from 'assets/launch/plus-icon-normal.svg';
import PlusIconHover from 'assets/launch/plus-icon-hover.svg';
import MinusIconNormal from 'assets/launch/minus-icon-normal.svg';
import MinusIconHover from 'assets/launch/minus-icon-hover.svg';
import {CustomButton} from 'components/Basic/CustomButton';
import {CustomSelectBox} from 'components/Basic';
import {Projects, VaultAny, VaultSchedule} from '@Launch/types';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import moment from 'moment';
import {selectLaunch} from '@Launch/launch.reducer';
import {useAppSelector} from 'hooks/useRedux';
import SingleCalendarPop from '../common/SingleCalendarPop';
import commafy from 'utils/commafy';
type ClaimRoundTable = {
  dateTime: number;
  tokenAllocation: number;
};

const defaultTableData = {
  claimRound: 1,
  claimTime: undefined,
  claimTokenAllocation: undefined,
};

const middleStyle = {
  border: 'solid 1px #eff1f6',
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
  const [claimDate, setClaimDate] = useState<number>(0);
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
  }, [claim]);

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
    [claim],
  );

  const setDate = useCallback(() => {
    const claimValue: VaultSchedule[] = claim.map(
      (data: VaultSchedule, index: number) => {
        //@ts-ignore
        const refTimeStamp = selectedVaultDetail.claim[0].claimTime;
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
  }, [claim, selectedDay]);

  let tokenAcc = 0;

  return (
    <Flex flexDir={'column'}>
      <Box
        mb={'15px'}
        d="flex"
        justifyContent={'space-between'}
        alignItems="center">
        <StepTitle title={'Claim Round'} fontSize={16}></StepTitle>
        <Flex>
          <Text
            fontSize={13}
            color={'#304156'}
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
          <Flex h={'42px'} fontSize={12} color={'#3d495d'} fontWeight={600}>
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
                    color={'#3d495d'}
                    fontWeight={600}>
                    <Text w={'90px'}>
                      {index > 8 ? `${index + 1}` : `0${index + 1}`}
                    </Text>
                    <Flex
                      w={'292px'}
                      borderX={middleStyle.border}
                      alignItems="center"
                      justifyContent={'center'}>
                      <Text mr={'5px'} color={'#3d495d'} fontSize={11}>
                        {data.claimTime === undefined
                          ? '-'
                          : moment
                              .unix(data.claimTime)
                              .format('YYYY.MM.DD hh:mm:ss')}
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
                        // focusBorderColor={isErr ? 'red.100' : '#dfe4ee'}
                        fontSize={12}
                        placeholder={''}
                        value={data.claimTokenAllocation || ''}
                        onChange={(e) => {
                          const {value} = e.target;
                          setFieldValue(
                            //@ts-ignore
                            `vaults[${selectedVaultDetail.index}].claim[${index}]`,
                            {
                              ...data,
                              claimTokenAllocation: Number(value),
                            },
                          );
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
                      {index === 0 ? (
                        <Flex
                          w={'24px'}
                          h={'24px'}
                          alignItems="center"
                          justifyContent="center"
                          border={'1px solid #e6eaee'}
                          bg={'white.100'}>
                          <HoverImage
                            action={() => addRow()}
                            img={PlusIconNormal}
                            hoverImg={PlusIconHover}></HoverImage>
                        </Flex>
                      ) : index + 1 !== claim.length ? (
                        <Flex
                          w={'24px'}
                          h={'24px'}
                          alignItems="center"
                          justifyContent="center"
                          border={'1px solid #e6eaee'}
                          bg={'white.100'}>
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
                            border={'1px solid #e6eaee'}
                            bg={'white.100'}
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
                            border={'1px solid #e6eaee'}
                            bg={'white.100'}>
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
