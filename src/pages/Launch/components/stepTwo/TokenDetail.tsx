import {
  Flex,
  Grid,
  GridItem,
  Select,
  Text,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react';
import {useTheme} from '@emotion/react';
import useTokenDetail from '@Launch/hooks/useTokenDetail';
import {saveTempVaultData, selectLaunch} from '@Launch/launch.reducer';
import {
  Projects,
  PublicTokenColData,
  VaultLiquidityIncentive,
  VaultPublic,
  VaultType,
} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import InputField from './InputField';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import commafy from 'utils/commafy';
import {shortenAddress} from 'utils';
import DoubleCalendarPop from '../common/DoubleCalendarPop';
import SingleCalendarPop from '../common/SingleCalendarPop';
import {useContract} from 'hooks/useContract';
import {DEPLOYED} from 'constants/index';
import InitialLiquidityComputeAbi from 'services/abis/Vault_InitialLiquidityCompute.json';
import {convertTimeStamp} from 'utils/convertTIme';
import {useToast} from 'hooks/useToast';
import {CustomTooltip} from 'components/Tooltip';
import {snapshotGap, stosMinimumRequirements} from '@Launch/const';
import {NumberInputStep} from './NumberInputField';
import momentTZ from 'moment-timezone';
import moment from 'moment';
import SelectPair from './TokenDetails/SelectPair';
import {usePoolByArrayQuery} from 'store/data/generated';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {Contract} from '@ethersproject/contracts';
import {useActiveWeb3React} from 'hooks/useWeb3';

export const MainTitle = (props: {
  leftTitle: string;
  rightTitle: string;
  subTitle?: string;
}) => {
  const {leftTitle, rightTitle, subTitle} = props;
  const {colorMode} = useColorMode();
  return (
    <Flex
      pl={'25px'}
      pr={'20px'}
      h={'60px'}
      alignItems="center"
      justifyContent={'space-between'}
      borderBottom={
        colorMode === 'light' ? 'solid 1px #e6eaee' : 'solid 1px #323232'
      }
      fontWeight={600}>
      <Text fontSize={14}>{leftTitle}</Text>
      <Flex>
        <Text>{rightTitle}</Text>
        {subTitle && (
          <Text
            ml={'5px'}
            color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}>
            {subTitle}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

const SubTitle = (props: {
  leftTitle: string;
  rightTitle: string | undefined;
  isLast?: boolean;
  percent?: number | undefined;
  isEdit: boolean;
  isSecondColData?: boolean;
  formikName: string;
  inputRef?: any;
  err?: boolean;
}) => {
  const {
    leftTitle,
    rightTitle,
    isLast,
    percent,
    isEdit,
    isSecondColData,
    formikName,
    inputRef,
    err,
  } = props;
  const [inputVal, setInputVal] = useState<number | string>(
    //@ts-ignore
    rightTitle,
  );
  const {colorMode} = useColorMode();
  const {values} = useFormikContext<Projects['CreateProject']>();
  const {vaults} = values;
  const publicVault = vaults[0] as VaultPublic;

  // console.log(leftTitle);
  // console.log(rightTitle);
  // console.log(inputVal);

  useEffect(() => {
    //@ts-ignore
    setInputVal(rightTitle);
  }, [rightTitle, isEdit]);

  function getTimeStamp() {
    switch (
      leftTitle as
        | 'Snapshot'
        | 'Whitelist'
        | 'Public Round 1'
        | 'Public Round 2'
        | 'Start Time'
    ) {
      case 'Snapshot': {
        return publicVault.snapshot;
      }
      case 'Whitelist': {
        return [publicVault.whitelist, publicVault.whitelistEnd];
      }
      case 'Public Round 1': {
        return [publicVault.publicRound1, publicVault.publicRound1End];
      }
      case 'Public Round 2': {
        return [publicVault.publicRound2, publicVault.publicRound2End];
      }
      case 'Start Time': {
        //@ts-ignore
        return vaults[1].startTime;
      }
      default:
        return 0;
    }
  }

  const [dateRange, setDateRange] = useState<number | undefined[]>(
    getTimeStamp() as number | undefined[],
  );
  const [claimDate, setClaimDate] = useState<number | undefined>(
    getTimeStamp() as number | undefined,
  );

  const dispatch = useAppDispatch();
  const {
    data: {tempVaultData, selectedVaultIndex},
  } = useAppSelector(selectLaunch);

  //get pool address
  const poolArr = usePoolByArrayQuery(
    {
      address:
        selectedVaultIndex && selectedVaultIndex > 5
          ? [String(tempVaultData.poolAddress)]
          : '',
    },
    //  {
    //    pollingInterval: ms`2s`,
    //  },
  );

  const {library} = useActiveWeb3React();

  useEffect(() => {
    async function fetchPooldata() {
      const data = poolArr.data.pools[0];
      const {token0, token1} = data;
      const TOKEN0_CONTRACT = new Contract(token0.id, ERC20.abi, library);
      const TOKEN1_CONTRACT = new Contract(token1.id, ERC20.abi, library);
      const TOKEN0_SYMBOL = await TOKEN0_CONTRACT.symbol();
      const TOKEN1_SYMBOL = await TOKEN1_CONTRACT.symbol();
      const tokenPair = `${TOKEN0_SYMBOL}-${TOKEN1_SYMBOL}`;

      return dispatch(
        saveTempVaultData({
          data: {
            ...tempVaultData,
            tokenPair,
          },
        }),
      );
    }
    if (poolArr?.data?.pools[0]) {
      fetchPooldata();
    } else {
      dispatch(
        saveTempVaultData({
          data: {
            ...tempVaultData,
            tokenPair: '',
          },
        }),
      );
    }
  }, [poolArr, library]);

  //@ts-ignore
  useEffect(() => {
    //Put timestamp
    switch (
      leftTitle as
        | 'Snapshot'
        | 'Whitelist'
        | 'Public Round 1'
        | 'Public Round 2'
        | 'Start Time'
    ) {
      case 'Snapshot': {
        if (selectedVaultIndex !== 0) {
          return null;
        }
        return dispatch(
          saveTempVaultData({
            data: {
              ...tempVaultData,
              snapshot: claimDate,
            },
          }),
        );
      }
      case 'Whitelist': {
        if (selectedVaultIndex !== 0) {
          return null;
        }
        return dispatch(
          saveTempVaultData({
            data: {
              ...tempVaultData,
              //@ts-ignore
              whitelist: dateRange[0],
              //@ts-ignore
              whitelistEnd: dateRange[1],
            },
          }),
        );
      }
      case 'Public Round 1': {
        if (selectedVaultIndex !== 0) {
          return null;
        }
        return dispatch(
          saveTempVaultData({
            data: {
              ...tempVaultData,
              //@ts-ignore
              publicRound1: dateRange[0],
              //@ts-ignore
              publicRound1End: dateRange[1],
            },
          }),
        );
      }
      case 'Public Round 2': {
        if (selectedVaultIndex !== 0) {
          return null;
        }
        return dispatch(
          saveTempVaultData({
            data: {
              ...tempVaultData,
              //@ts-ignore
              publicRound2: dateRange[0],
              //@ts-ignore
              publicRound2End: dateRange[1],
            },
          }),
        );
      }
      case 'Start Time': {
        if (selectedVaultIndex !== 1) {
          return null;
        }
        return dispatch(
          saveTempVaultData({
            data: {
              ...tempVaultData,
              startTime: claimDate,
            },
          }),
        );
      }
      default:
        break;
    }
    /*eslint-disable*/
  }, [dateRange, claimDate, leftTitle, selectedVaultIndex]);

  let tempValueKey = () => {
    switch (leftTitle) {
      case 'Snapshot':
        return {key0: 'snapshot'};
      case 'Whitelist':
        return {
          key0: 'whitelist',
          key1: 'whitelistEnd',
        };
      case 'Public Round 1':
        return {
          key0: 'publicRound1',
          key1: 'publicRound1End',
        };
      case 'Public Round 2':
        return {
          key0: 'publicRound2',
          key1: 'publicRound2End',
        };
        defaut: break;
    }
  };

  const displayRightTitle = (leftTitle: any, rightTitle: any) => {
    switch (leftTitle) {
      case 'Public Round 1':
        return `${commafy(rightTitle)} ${values.tokenName}`;
      case 'Public Round 2':
        return `${commafy(rightTitle)} ${values.tokenName}`;
      case 'Token Allocation for Liquidity Pool (5~50%)':
        return `${rightTitle} %`;
      case 'Minimum Fundraising Amount':
        return `${commafy(rightTitle)} TON`;
      case 'Address for receiving funds':
        return rightTitle ? `${shortenAddress(rightTitle)}` : '-';
      case 'Start Time':
        return rightTitle
          ? `${convertTimeStamp(rightTitle, 'YYYY-MM-DD HH:mm:ss')}`
          : '-';
      case 'custom LP':
        return <></>;
      case 'Select Pair':
      default:
        return rightTitle;
    }
  };

  const RightInputComponent = useMemo(() => {
    switch (leftTitle) {
      case 'Token Allocation for Liquidity Pool (5~50%)':
        return (
          <NumberInputStep
            valueProp={inputVal}
            formikName={formikName}></NumberInputStep>
        );
      case 'Start Time':
        return (
          <Flex>
            <Text mr={'5px'}>
              {claimDate
                ? convertTimeStamp(claimDate, 'YYYY-MM-DD HH:mm:ss')
                : '-'}
            </Text>
            <SingleCalendarPop
              setDate={setClaimDate}
              //Mainnet env
              startTimeCap={
                //@ts-ignore
                values.vaults[0].publicRound2End
                  ? //@ts-ignore
                    values.vaults[0].publicRound2End
                  : 0
              }
              //Testnet env
              // startTimeCap={moment()
              //   .add('11', 'minutes')
              //     .unix()}
            ></SingleCalendarPop>
          </Flex>
        );
      case 'Select Pair':
        if (selectedVaultIndex && selectedVaultIndex > 5) {
          return <Text>{tempVaultData.tokenPair}</Text>;
        }
        return <Text>{inputVal}</Text>;
      case 'Pool Address\n(0.3% fee)':
        if (selectedVaultIndex && selectedVaultIndex < 6) {
          return <Text>{inputVal}</Text>;
        }

        //selectbox feedback

        if (selectedVaultIndex && selectedVaultIndex > 5) {
          const {DOCPool_Address, pools} = DEPLOYED;
          const selectList = [
            {title: 'DOC-TOS', value: DOCPool_Address},
            {title: 'TOS_WTON', value: pools.TOS_WTON_POOL},
            {title: 'CUSTOM', value: ''},
          ];
          return (
            <Select
              style={{
                height: '32px',
                border: '1px solid #dfe4ee',
                borderRadius: '4px',
                paddingLeft: '16px',
                paddingRight: '16px',
              }}
              w={'150px'}
              fontSize={13}
              color={'#86929d'}
              name={'sector'}
              onChange={(e: any) => {
                setInputVal(e.target.value);
              }}>
              <option disabled selected>
                select
              </option>
              {selectList.map((selectData: {title: string; value: string}) => {
                return (
                  <option value={selectData.value}>{selectData.title}</option>
                );
              })}
            </Select>
          );
        }
        return (
          <InputField
            w={120}
            h={32}
            fontSize={13}
            value={inputVal}
            setValue={setInputVal}
            formikName={formikName}
            inputRef={inputRef}
            style={{textAlign: 'right'}}></InputField>
        );
      case 'Address for receiving funds':
        return (
          <Tooltip label={inputVal} placement={'top'}>
            <Flex>
              <InputField
                w={120}
                h={32}
                fontSize={13}
                value={inputVal}
                setValue={setInputVal}
                formikName={formikName}
                inputRef={inputRef}
                style={{textAlign: 'right'}}></InputField>
            </Flex>
          </Tooltip>
        );
      case 'Minimum Fundraising Amount':
        const tooltipLabel = values.projectTokenPrice * Number(inputVal);
        return (
          <Tooltip
            label={` = ${isNaN(tooltipLabel) ? '0' : tooltipLabel} ${
              values.tokenSymbol
            }`}
            placement={'top'}
            minW={'120px'}
            minH={'32px'}
            textAlign="center"
            lineHeight={'32px'}>
            <Flex>
              <InputField
                w={120}
                h={32}
                fontSize={13}
                value={inputVal}
                setValue={setInputVal}
                formikName={formikName}
                inputRef={inputRef}
                style={{textAlign: 'right'}}
                tokenSymbol={'TON'}></InputField>
            </Flex>
          </Tooltip>
        );
      case 'Public Round 1': {
        const tooltipLabel = Number(inputVal) / values.projectTokenPrice;
        return (
          <Tooltip
            label={` = ${isNaN(tooltipLabel) ? '0' : tooltipLabel} TON`}
            placement={'top'}
            minW={'120px'}
            minH={'32px'}
            textAlign="center"
            lineHeight={'32px'}>
            <Flex>
              <InputField
                w={120}
                h={32}
                fontSize={13}
                value={inputVal}
                setValue={setInputVal}
                formikName={formikName}
                inputRef={inputRef}
                style={{textAlign: 'right'}}
                tokenSymbol={values.tokenSymbol}></InputField>
            </Flex>
          </Tooltip>
        );
      }
      case 'Public Round 2': {
        const tooltipLabel = Number(inputVal) / values.projectTokenPrice;
        return (
          <Tooltip
            label={` = ${isNaN(tooltipLabel) ? '0' : tooltipLabel} TON`}
            placement={'top'}
            minW={'120px'}
            minH={'32px'}
            textAlign="center"
            lineHeight={'32px'}>
            <Flex>
              <InputField
                w={120}
                h={32}
                fontSize={13}
                value={inputVal}
                setValue={setInputVal}
                formikName={formikName}
                inputRef={inputRef}
                style={{textAlign: 'right'}}
                tokenSymbol={values.tokenSymbol}></InputField>
            </Flex>
          </Tooltip>
        );
      }

      default:
        return (
          <InputField
            w={120}
            h={32}
            fontSize={13}
            value={inputVal}
            setValue={setInputVal}
            formikName={formikName}
            inputRef={inputRef}
            style={{textAlign: 'right'}}
            tokenSymbol={values.tokenSymbol}></InputField>
        );
    }
  }, [inputVal, values.projectTokenPrice, tempVaultData]);

  const LeftTitleComponent = () => {
    switch (leftTitle) {
      case 'Public Round 1':
        return (
          <Flex>
            <Text w={'88px'} color={'#7e8993'}>
              {leftTitle}
            </Text>
            <CustomTooltip
              msg={[
                'The sum of public round 1 and 2 must equal',
                'the value of total token allocation.',
              ]}
              toolTipH="44px"
              toolTipW={254}
              placement={'top'}></CustomTooltip>
          </Flex>
        );
      case 'Minimum Fundraising Amount':
        return (
          <Flex>
            <Text color={'#7e8993'} mr={'5px'}>
              Minimum Fund- <br />
              raising Amount
            </Text>
            <CustomTooltip
              msg={[
                'Minimum Fund Raising Amount is the minimum amount',
                'of money you want to achieve through a public sale.',
                'A project is considered a failure if it is not achieved.',
                'If it fails, the investor can recover the amount.',
                '<br />',
                'Enterable from zero, but sufficient funding considering',
                'a certain percentage(5~10%) is delivered',
                'to the Initial Liquidity Vault after the public sale.',
              ]}
              toolTipH="154px"
              toolTipW={322}
              placement={'top'}
              style={{
                fontSize: 12,
              }}></CustomTooltip>
          </Flex>
        );
      case 'Exchange Ratio\n1 TOS':
        return (
          <Flex>
            <Text color={'#7e8993'} mr={'5px'}>
              Exchange Ratio
              <br />1 TOS
            </Text>
          </Flex>
        );
      case 'Snapshot':
        return (
          <Flex pos={'relative'}>
            <Text
              color={'#7e8993'}
              w={!leftTitle.includes('or Liquidity Pool') ? '101px' : '201px'}>
              {leftTitle}
            </Text>
            <Flex
              right={'20px'}
              pos="absolute"
              h={'100%'}
              alignItems="center"
              justifyContent={'center'}>
              <CustomTooltip
                toolTipW={322}
                toolTipH={'224px'}
                msg={[
                  'Snapshot is a stage to identify if users have met the',
                  'requirements to participate in Public Round 1',
                  'and to determine the users’ tier. Requirements for each',
                  'project’s Public Round 1 may vary.',
                  'Based on this snapshot, tiers for sTOS holders are',
                  'determined, and the higher the tier, the more project',
                  'tokens allocated.',
                  'Once the snapshot is taken, no matter how much sTOS',
                  'a user has, their tier cannot be changed.',
                  '<br />',
                  '!*Snapshot date must be set 1 week after Deployment',
                  '!completion',
                ]}
                placement={'top'}
                important={true}></CustomTooltip>
            </Flex>
          </Flex>
        );
      default:
        return (
          <Flex pos={'relative'}>
            <Text
              color={'#7e8993'}
              w={!leftTitle.includes('or Liquidity Pool') ? '101px' : '201px'}>
              {leftTitle}
            </Text>
          </Flex>
        );
    }
  };

  return (
    <Flex
      pl={'25px'}
      pr={'20px'}
      h={'60px'}
      alignItems="center"
      justifyContent={'space-between'}
      borderBottom={
        isLast
          ? ''
          : colorMode === 'light'
          ? 'solid 1px #e6eaee'
          : 'solid 1px #323232'
      }
      fontWeight={600}>
      <LeftTitleComponent></LeftTitleComponent>
      {isEdit ? (
        isSecondColData ? (
          <Flex>
            <Flex flexDir={'column'} textAlign={'right'} mr={'8px'}>
              <Text>
                {
                  //@ts-ignore
                  tempVaultData[tempValueKey()?.key0]
                    ? convertTimeStamp(
                        //@ts-ignore
                        tempVaultData[tempValueKey()?.key0],
                        'YYYY.MM.DD HH:mm:ss',
                      )
                    : rightTitle?.split('~')[0] || '-'
                }
              </Text>

              {leftTitle !== 'Snapshot' && (
                <Text>
                  {
                    //@ts-ignore
                    tempVaultData[tempValueKey()?.key1]
                      ? `~ ${convertTimeStamp(
                          //@ts-ignore
                          tempVaultData[tempValueKey()?.key1],
                          'MM.DD HH:mm:ss',
                        )}`
                      : `~ ${rightTitle?.split('~')[1]}` || '-'
                  }
                </Text>
              )}
            </Flex>
            {leftTitle !== 'Snapshot' ? (
              <DoubleCalendarPop
                setDate={setDateRange}
                startTimeCap={
                  leftTitle === 'Whitelist'
                    ? tempVaultData.snapshot
                      ? tempVaultData.snapshot + 1
                      : publicVault.snapshot || moment().unix()
                    : leftTitle === 'Public Round 1'
                    ? tempVaultData.whitelistEnd
                      ? tempVaultData.whitelistEnd + 1
                      : publicVault.whitelistEnd || moment().unix()
                    : tempVaultData.publicRound1End
                    ? tempVaultData.publicRound1End + 1
                    : publicVault.publicRound1End || moment().unix()
                }></DoubleCalendarPop>
            ) : (
              <SingleCalendarPop
                setDate={setClaimDate}
                //Mainnet env
                startTimeCap={snapshotGap}
                //Testnet env
                // startTimeCap={moment()
                //   .add('11', 'minutes')
                //     .unix()}
              ></SingleCalendarPop>
            )}
          </Flex>
        ) : (
          <Flex>
            {RightInputComponent}
            {percent !== undefined && (
              <Text
                ml={'5px'}
                color={'#7e8993'}
                textAlign={'center'}
                lineHeight={'32px'}
                fontWeight={100}>
                {`(${
                  percent.toFixed(3).replace(/\.(\d\d)\d?$/, '.$1') || '-'
                }%)`}
              </Text>
            )}
          </Flex>
        )
      ) : String(rightTitle)?.includes('~') ? (
        <Flex
          flexDir={'column'}
          color={err ? '#ff3b3b' : ''}
          textAlign={'right'}>
          <Text>{String(rightTitle).split('~')[0]}</Text>
          <Text>~ {String(rightTitle).split('~')[1]}</Text>
        </Flex>
      ) : (
        <Flex color={err ? '#ff3b3b' : ''}>
          {leftTitle === 'Address for receiving funds' ? (
            <Tooltip label={rightTitle} placement={'top'}>
              <Text textAlign={'right'}>
                {String(rightTitle)?.includes('undefined')
                  ? '-'
                  : displayRightTitle(leftTitle, rightTitle)}
              </Text>
            </Tooltip>
          ) : leftTitle.includes('Minimum') ? (
            <Tooltip
              label={` = ${values.projectTokenPrice * Number(rightTitle)} ${
                values.tokenSymbol
              }`}
              placement={'top'}>
              <Text textAlign={'right'}>
                {String(rightTitle)?.includes('undefined')
                  ? '-'
                  : displayRightTitle(leftTitle, rightTitle)}
              </Text>
            </Tooltip>
          ) : leftTitle.includes('Exchange Ratio') ? (
            <Text textAlign={'right'}>
              {String(rightTitle)?.includes('undefined')
                ? '-'
                : displayRightTitle(
                    leftTitle,
                    `${rightTitle} ${values.tokenSymbol}`,
                  )}
            </Text>
          ) : (
            <Text textAlign={'right'}>
              {String(rightTitle)?.includes('undefined')
                ? '-'
                : displayRightTitle(leftTitle, rightTitle)}
            </Text>
          )}

          {percent !== undefined && (
            <Text
              ml={'5px'}
              color={err ? '#ff3b3b' : '#7e8993'}
              textAlign={'right'}>
              {`(${percent.toFixed(3).replace(/\.(\d\d)\d?$/, '.$1') || '-'}%)`}
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  );
};

const STOSTier = (props: {
  tier: string;
  requiredTos: number | undefined;
  allocatedToken: number | undefined;
  isLast?: boolean;
  isEdit: boolean;
  inputRef: any;
  err: boolean;
}) => {
  const {tier, requiredTos, allocatedToken, isLast, isEdit, inputRef, err} =
    props;
  const {colorMode} = useColorMode();
  const [inputVal, setInputVal] = useState(requiredTos);
  const [inputVal2, setInputVal2] = useState(allocatedToken);
  const {values} = useFormikContext<Projects['CreateProject']>();

  //@ts-ignore
  const publicRound1Allocation = values.vaults[0].publicRound1Allocation;
  const percent =
    (Number(allocatedToken) * 100) / Number(publicRound1Allocation);
  const [percentVal, setPercentVal] = useState(percent);

  useEffect(() => {
    const percent = (Number(inputVal2) * 100) / Number(publicRound1Allocation);
    setPercentVal(percent);
  }, [inputVal2]);

  useEffect(() => {
    setInputVal(requiredTos);
    setInputVal2(allocatedToken);
  }, [isEdit]);

  return (
    <Flex
      h={'60px'}
      alignItems="center"
      textAlign={'center'}
      borderBottom={
        isLast
          ? ''
          : colorMode === 'light'
          ? 'solid 1px #e6eaee'
          : 'solid 1px #323232'
      }
      fontWeight={600}>
      <Text color={'#7e8993'} w={'80px'}>
        {tier}
      </Text>
      {isEdit ? (
        <>
          <Flex w={'125px'} justifyContent="center">
            <InputField
              w={85}
              h={32}
              fontSize={13}
              value={inputVal}
              setValue={setInputVal}
              isStosTier={true}
              formikName={'requiredStos'}
              stosTierLevel={Number(tier) as 1 | 2 | 3 | 4}
              style={{textAlign: 'center'}}
              inputRef={inputRef}></InputField>
          </Flex>
          <Flex w={'137px'} justifyContent="center">
            <InputField
              w={85}
              h={32}
              fontSize={13}
              value={inputVal2}
              setValue={setInputVal2}
              isStosTier={true}
              stosTierLevel={Number(tier) as 1 | 2 | 3 | 4}
              style={{textAlign: 'right'}}
              formikName={'allocatedToken'}
              inputRef={inputRef}></InputField>
            <Text
              mx={'5px'}
              maxW={'34px'}
              color={'#7e8993'}
              textAlign={'center'}
              lineHeight={'32px'}
              fontWeight={100}>
              {isNaN(percentVal)
                ? '(- %)'
                : // : `(${
                  //     percentVal.toFixed(3).replace(/\.(\d\d)\d?$/, '.$1') || '-'
                  // }%)`}
                  `(${
                    percentVal > 100 ? '-' : String(percentVal).split('.')[0]
                  }%)`}
            </Text>
          </Flex>
        </>
      ) : (
        <Flex textAlign={'center'} lineHeight={'32px'}>
          <Text w={'125px'}>{commafy(requiredTos) || '-'}</Text>
          <Flex
            w={'137px'}
            justifyContent={'center'}
            alignItems={'center'}
            color={err ? '#ff3b3b' : ''}>
            <Text>{commafy(allocatedToken) || '-'}</Text>
            <Text
              ml={'5px'}
              color={'#7e8993'}
              textAlign={'center'}
              lineHeight={'32px'}
              fontWeight={100}>
              {isNaN(percent)
                ? '(- %)'
                : `(${
                    Number(percent)
                      .toFixed(3)
                      .replace(/\.(\d\d)\d?$/, '.$1') || '-'
                  }%)`}
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

const PublicTokenDetail = (props: {
  firstColData:
    | PublicTokenColData['firstColData']
    | PublicTokenColData['liquidityColData']
    | PublicTokenColData['initialLiquidityColData']
    | null;
  secondColData: PublicTokenColData['secondColData'] | null;
  thirdColData: PublicTokenColData['thirdColData'] | null;
  isEdit: boolean;
  setIsConfirm: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const theme = useTheme();
  //@ts-ignore
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  const {firstColData, secondColData, thirdColData, isEdit, setIsConfirm} =
    props;
  const {values} = useFormikContext<Projects['CreateProject']>();
  // const publicVaultValue = vaults.filter((vault: VaultCommon) => {
  //   return vault.vaultName === 'Public';
  // });
  const {selectedVaultDetail} = useVaultSelector();
  const vaults = values.vaults;
  const inputRef = useRef({});
  const {
    data: {tempVaultData, selectedVaultType, onBlur},
  } = useAppSelector(selectLaunch);

  const {toastMsg} = useToast();

  //Input Value Validating
  useEffect(() => {
    const errBorderStyle = '1px solid #ff3b3b';
    const noErrBorderStyle =
      colorMode === 'light' ? '1px solid #dfe4ee' : '1px solid #373737';
    const {current} = inputRef;

    if (onBlur.tokenDetail === false) {
      return;
    }

    switch (selectedVaultType as VaultType) {
      //Switch for each vault type
      //Check to include keys for validating

      case 'Public': {
        if (
          selectedVaultDetail &&
          current &&
          //@ts-ignore
          current.publicRound1Allocation !== null &&
          //@ts-ignore
          current.publicRound1Allocation !== undefined
        ) {
          const tokenAllocation = selectedVaultDetail.vaultTokenAllocation;
          const {
            publicRound1Allocation,
            publicRound2Allocation,
            requiredStos_1,
            requiredStos_2,
            requiredStos_3,
            requiredStos_4,
            allocatedToken_1,
            allocatedToken_2,
            allocatedToken_3,
            allocatedToken_4,
          } = current as {
            publicRound1Allocation: HTMLInputElement;
            publicRound2Allocation: HTMLInputElement;
            requiredStos_1: HTMLInputElement;
            requiredStos_2: HTMLInputElement;
            requiredStos_3: HTMLInputElement;
            requiredStos_4: HTMLInputElement;
            allocatedToken_1: HTMLInputElement;
            allocatedToken_2: HTMLInputElement;
            allocatedToken_3: HTMLInputElement;
            allocatedToken_4: HTMLInputElement;
          };
          const pr1TokenNum = Number(publicRound1Allocation.value);
          const pr2TokenNum = Number(publicRound2Allocation.value);
          const requiredStos_1_num = Number(requiredStos_1.value);
          const requiredStos_2_num = Number(requiredStos_2.value);
          const requiredStos_3_num = Number(requiredStos_3.value);
          const requiredStos_4_num = Number(requiredStos_4.value);
          const allocatedToken_1_num = Number(allocatedToken_1.value);
          const allocatedToken_2_num = Number(allocatedToken_2.value);
          const allocatedToken_3_num = Number(allocatedToken_3.value);
          const allocatedToken_4_num = Number(allocatedToken_4.value);

          const tokenIsOver = pr1TokenNum + pr2TokenNum - tokenAllocation > 0;
          const tokenIsNotEnough =
            pr1TokenNum + pr2TokenNum - tokenAllocation < 0;
          const stosTokenAllocationOver =
            allocatedToken_1_num +
              allocatedToken_2_num +
              allocatedToken_3_num +
              allocatedToken_4_num -
              pr1TokenNum >
            0;

          if (requiredStos_1_num < stosMinimumRequirements.tier1) {
            requiredStos_1.style.border = errBorderStyle;
            toastMsg({
              title: 'sTOS minimum Requirement',
              description: '1Tier needs at least 600sTOS',
              duration: 2000,
              isClosable: true,
              status: 'error',
            });
            return setIsConfirm(true);
          } else {
            requiredStos_1.style.border = noErrBorderStyle;
            setIsConfirm(false);
          }

          if (requiredStos_2_num < stosMinimumRequirements.tier2) {
            requiredStos_2.style.border = errBorderStyle;
            toastMsg({
              title: 'sTOS minimum Requirement',
              description: '2Tier needs at least 1200sTOS',
              duration: 2000,
              isClosable: true,
              status: 'error',
            });
            return setIsConfirm(true);
          } else {
            requiredStos_2.style.border = noErrBorderStyle;
            setIsConfirm(false);
          }

          if (requiredStos_3_num < stosMinimumRequirements.tier3) {
            requiredStos_3.style.border = errBorderStyle;
            toastMsg({
              title: 'sTOS minimum Requirement',
              description: '3Tier needs at least 2200sTOS',
              duration: 2000,
              isClosable: true,
              status: 'error',
            });
            return setIsConfirm(true);
          } else {
            requiredStos_3.style.border = noErrBorderStyle;
            setIsConfirm(false);
          }

          if (requiredStos_4_num < stosMinimumRequirements.tier4) {
            requiredStos_4.style.border = errBorderStyle;
            toastMsg({
              title: 'sTOS minimum Requirement',
              description: '4Tier needs at least 6000sTOS',
              duration: 2000,
              isClosable: true,
              status: 'error',
            });
            return setIsConfirm(true);
          } else {
            requiredStos_4.style.border = noErrBorderStyle;
            setIsConfirm(false);
          }

          if (tokenIsOver) {
            // publicRound1Allocation.style.border = errBorderStyle;
            // publicRound2Allocation.style.border = errBorderStyle;

            // toastMsg({
            //   title: 'Token Allocation to this vault is over',
            //   description:
            //     'You have to put less token or adjust token allocation for public rounds',
            //   duration: 2000,
            //   isClosable: true,
            //   status: 'error',
            // });
            return setIsConfirm(true);
          } else if (tokenIsNotEnough) {
            // publicRound1Allocation.style.border = errBorderStyle;
            // publicRound2Allocation.style.border = errBorderStyle;

            // toastMsg({
            //   title: 'Token Allocation to this vault is not enough',
            //   description:
            //     'You have to put more token or adjust token allocation for public rounds',
            //   duration: 2000,
            //   isClosable: true,
            //   status: 'error',
            // });
            return setIsConfirm(true);
          } else {
            publicRound1Allocation.style.border = noErrBorderStyle;
            publicRound2Allocation.style.border = noErrBorderStyle;
            setIsConfirm(false);
          }
          if (stosTokenAllocationOver) {
            allocatedToken_1.style.border = errBorderStyle;
            allocatedToken_2.style.border = errBorderStyle;
            allocatedToken_3.style.border = errBorderStyle;
            allocatedToken_4.style.border = errBorderStyle;

            toastMsg({
              title: 'Public Round 1 Token Allocation is not enough',
              description:
                'You have to put more token or adjust token allocation for sTOS Tier',
              duration: 2000,
              isClosable: true,
              status: 'error',
            });
            return setIsConfirm(true);
          } else {
            allocatedToken_1.style.border = noErrBorderStyle;
            allocatedToken_2.style.border = noErrBorderStyle;
            allocatedToken_3.style.border = noErrBorderStyle;
            allocatedToken_4.style.border = noErrBorderStyle;
            setIsConfirm(false);
          }
        }
      }
    }
  }, [selectedVaultType, tempVaultData, selectedVaultDetail, onBlur]);

  useEffect(() => {
    if (
      selectedVaultType === 'Liquidity Incentive' &&
      selectedVaultDetail?.isMandatory === false
    ) {
    }
  }, [selectedVaultType, selectedVaultDetail]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      tempVaultData.snapshot &&
      tempVaultData.whitelist === undefined &&
      tempVaultData.whitelistEnd === undefined &&
      tempVaultData.publicRound1 === undefined &&
      tempVaultData.publicRound1End === undefined &&
      tempVaultData.publicRound2 === undefined &&
      tempVaultData.publicRound2End === undefined
    ) {
      const oneDaySec = 86400;
      dispatch(
        saveTempVaultData({
          data: {
            ...tempVaultData,
            whitelist: tempVaultData.snapshot + oneDaySec,
            whitelistEnd: tempVaultData.snapshot + oneDaySec * 2,
            publicRound1: tempVaultData.snapshot + 1 + oneDaySec * 2,
            publicRound1End: tempVaultData.snapshot + oneDaySec * 3,
            publicRound2: tempVaultData.snapshot + 1 + oneDaySec * 4,
            publicRound2End: tempVaultData.snapshot + oneDaySec * 5,
          },
        }),
      );
    }
  }, [tempVaultData.snapshot]);

  if (firstColData && secondColData === null && thirdColData === null) {
    return (
      <Grid
        {...OpenCampaginDesign.border({colorMode})}
        w={'100%'}
        // templateColumns="repeat(3, 1fr)"
        fontSize={13}>
        <GridItem>
          <MainTitle
            leftTitle="Token"
            rightTitle={`${commafy(
              selectedVaultDetail?.vaultTokenAllocation,
            )} ${values.tokenName}`}
            subTitle={
              selectedVaultDetail?.vaultTokenAllocation === 0
                ? '-'
                : `(${(
                    (Number(selectedVaultDetail?.vaultTokenAllocation) * 100) /
                    values.totalTokenAllocation
                  )
                    .toString()
                    .match(/^\d+(?:\.\d{0,2})?/)}%)`
            }></MainTitle>
          {firstColData?.map(
            (
              data: {
                title: string;
                content: string | undefined;
                percent?: number | undefined;
                formikName: string;
              },
              index: number,
            ) => {
              const {title, content, percent, formikName} = data;
              return (
                <SubTitle
                  key={title}
                  leftTitle={title}
                  rightTitle={content !== '-' ? content : undefined}
                  isLast={index + 1 === firstColData.length}
                  inputRef={inputRef}
                  percent={percent}
                  isEdit={isEdit}
                  formikName={formikName}></SubTitle>
              );
            },
          )}
        </GridItem>
      </Grid>
    );
  }

  return (
    <Grid
      {...OpenCampaginDesign.border({colorMode})}
      w={'100%'}
      templateColumns="repeat(3, 1fr)"
      fontSize={13}>
      <GridItem>
        <MainTitle
          leftTitle="Token"
          rightTitle={`${commafy(selectedVaultDetail?.vaultTokenAllocation)} ${
            values.tokenName
          }`}
          subTitle={
            selectedVaultDetail?.vaultTokenAllocation === 0
              ? '-'
              : `(${(
                  (Number(selectedVaultDetail?.vaultTokenAllocation) * 100) /
                  values.totalTokenAllocation
                )
                  .toString()
                  .match(/^\d+(?:\.\d{0,2})?/)}%)`
          }></MainTitle>
        {firstColData?.map((data: any, index: number) => {
          const {title, content, percent, formikName, err} = data;
          return (
            <SubTitle
              key={title}
              leftTitle={title}
              rightTitle={content}
              isLast={index + 1 === firstColData.length}
              inputRef={inputRef}
              percent={percent}
              isEdit={isEdit}
              formikName={formikName}
              err={err}></SubTitle>
          );
        })}
      </GridItem>
      <GridItem
        borderX={
          colorMode === 'light' ? 'solid 1px #e6eaee' : 'solid 1px #323232'
        }>
        <MainTitle
          leftTitle="Schedule"
          rightTitle={`UTC ${momentTZ
            .tz(momentTZ.tz.guess())
            .format('Z')}`}></MainTitle>
        {secondColData?.map(
          (data: {
            title: string;
            content: string;
            formikName: string;
            err: boolean;
          }) => {
            const {title, content, formikName, err} = data;
            return (
              <SubTitle
                key={title}
                leftTitle={title}
                rightTitle={content}
                isEdit={isEdit}
                isSecondColData={true}
                formikName={formikName}
                err={err}></SubTitle>
            );
          },
        )}
        {/* {secondColData === null && (
          <Flex
            alignItems={'center'}
            justifyContent="center"
            h={
              firstColData?.length !== undefined
                ? `${firstColData.length * 60}px`
                : '60px'
            }
            fontSize={13}
            color={'#808992'}
            fontWeight={600}>
            <Text>There is no Schedule value.</Text>
          </Flex>
        )} */}
      </GridItem>
      <GridItem>
        <MainTitle leftTitle="sTOS Tier" rightTitle=""></MainTitle>
        {thirdColData && (
          <Flex
            h={'60px'}
            alignItems="center"
            textAlign={'center'}
            borderBottom={
              colorMode === 'light' ? 'solid 1px #e6eaee' : 'solid 1px #323232'
            }
            fontWeight={600}
            color={'#7e8993'}
            fontSize={13}>
            <Text w={'80px'}>Tier</Text>
            <Text w={'125px'}>Required sTOS</Text>
            <Text w={'137px'}>Allocated Token</Text>
          </Flex>
        )}
        {thirdColData?.map((data: any, index: number) => {
          const {tier, requiredTos, allocatedToken, err} = data;
          return (
            <STOSTier
              key={tier}
              tier={tier}
              requiredTos={requiredTos}
              allocatedToken={allocatedToken}
              isLast={index + 1 === thirdColData.length}
              isEdit={isEdit}
              inputRef={inputRef}
              err={err}></STOSTier>
          );
        })}
        {/* {thirdColData === null && (
          <Flex
            alignItems={'center'}
            justifyContent="center"
            h={
              firstColData?.length !== undefined
                ? `${firstColData.length * 60}px`
                : '60px'
            }
            fontSize={13}
            color={'#808992'}
            fontWeight={600}>
            <Text>There is no sTOS Tier value.</Text>
          </Flex>
        )} */}
      </GridItem>
    </Grid>
  );
};

const TokenDetail = (props: {
  isEdit: boolean;
  setIsConfirm: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const {isEdit, setIsConfirm} = props;
  const {
    data: {selectedVaultType, selectedVault, selectedVaultIndex},
  } = useAppSelector(selectLaunch);
  const {InitialLiquidityVault} = DEPLOYED;
  const InitialLiquidity_CONTRACT = useContract(
    InitialLiquidityVault,
    InitialLiquidityComputeAbi.abi,
  );
  const {TOS_ADDRESS} = DEPLOYED;
  const {values} = useFormikContext<Projects['CreateProject']>();
  const [poolAddress, setPoolAddress] = useState<string>('');
  const {publicTokenColData} = useTokenDetail();
  const {
    data: {tempVaultData},
  } = useAppSelector(selectLaunch);

  const VaultTokenDetail = useMemo(() => {
    switch (selectedVaultType) {
      case 'Public':
        if (publicTokenColData) {
          return (
            <PublicTokenDetail
              firstColData={publicTokenColData.firstColData}
              secondColData={publicTokenColData.secondColData}
              thirdColData={publicTokenColData.thirdColData}
              isEdit={isEdit}
              setIsConfirm={setIsConfirm}></PublicTokenDetail>
          );
        }
        return null;
      case 'Initial Liquidity': {
        const thisVault: VaultLiquidityIncentive = values.vaults.filter(
          //@ts-ignore
          (vault: VaultLiquidityIncentive) => vault.vaultName === selectedVault,
        )[0] as VaultLiquidityIncentive;
        return (
          <PublicTokenDetail
            firstColData={[
              {
                title: 'Select Pair',
                content: `${values.tokenName}-TOS`,
                formikName: 'tokenPair',
              },
              {
                title: 'Pool Address\n(0.3% fee)',
                content: '0.3%',
                formikName: 'poolAddress',
              },
              {
                title: 'Exchange Ratio\n1 TOS',
                content: `${String(values.tosPrice)}`,
                formikName: 'tosPrice',
              },
              {
                title: 'Start Time',
                content: `${String(thisVault.startTime)}`,
                formikName: 'startTime',
              },
            ]}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}
            setIsConfirm={setIsConfirm}></PublicTokenDetail>
        );
      }
      case 'TON Staker':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}
            setIsConfirm={setIsConfirm}></PublicTokenDetail>
        );
      case 'TOS Staker':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}
            setIsConfirm={setIsConfirm}></PublicTokenDetail>
        );
      case 'WTON-TOS LP Reward': {
        const {
          pools: {TOS_WTON_POOL},
        } = DEPLOYED;
        return (
          <PublicTokenDetail
            firstColData={[
              {
                title: 'Select Pair',
                content: 'WTON-TOS',
                formikName: 'tokenPair',
              },
              {
                title: 'Pool Address\n(0.3% fee)',
                content: shortenAddress(TOS_WTON_POOL),
                formikName: 'poolAddress',
              },
            ]}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}
            setIsConfirm={setIsConfirm}></PublicTokenDetail>
        );
      }
      case 'C':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}
            setIsConfirm={setIsConfirm}></PublicTokenDetail>
        );
      case 'DAO':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}
            setIsConfirm={setIsConfirm}></PublicTokenDetail>
        );
      case 'Liquidity Incentive':
        const thisVault: VaultLiquidityIncentive = values.vaults.filter(
          //@ts-ignore
          (vault: VaultLiquidityIncentive) =>
            vault.index === selectedVaultIndex,
        )[0] as VaultLiquidityIncentive;

        return (
          <PublicTokenDetail
            firstColData={[
              {
                title: 'Select Pair',
                content:
                  thisVault?.isMandatory === true
                    ? `${values.tokenName}-TOS`
                    : thisVault?.tokenPair,
                formikName: 'tokenPair',
              },
              {
                title: 'Pool Address\n(0.3% fee)',
                content: thisVault?.poolAddress
                  ? shortenAddress(thisVault?.poolAddress)
                  : '-',
                formikName: 'poolAddress',
              },
            ]}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}
            setIsConfirm={setIsConfirm}></PublicTokenDetail>
        );
      default:
        return <>no container for this vault :(</>;
    }
  }, [selectedVaultIndex, isEdit, publicTokenColData, tempVaultData]);

  return VaultTokenDetail;

  //   return <>{isEdit ? VaultTokenDetailEdit : VaultTokenDetail}</>;
};

export default TokenDetail;
