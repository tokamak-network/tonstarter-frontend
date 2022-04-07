import {Flex, Grid, GridItem, Text, useColorMode} from '@chakra-ui/react';
import {useTheme} from '@emotion/react';
import useTokenDetail from '@Launch/hooks/useTokenDetail';
import {selectLaunch} from '@Launch/launch.reducer';
import {Projects, PublicTokenColData, VaultCommon} from '@Launch/types';
import HoverImage from 'components/HoverImage';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect, useMemo, useRef, useState} from 'react';
import InputField from './InputField';
import CalendarActiveImg from 'assets/launch/calendar-active-icon.svg';
import CalendarInactiveImg from 'assets/launch/calendar-inactive-icon.svg';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import commafy from 'utils/commafy';
import {shortenAddress} from 'utils';
import DoubleCalendarPop from '../common/DoubleCalendarPop';
import SingleCalendarPop from '../common/SingleCalendarPop';

export const MainTitle = (props: {leftTitle: string; rightTitle: string}) => {
  const {leftTitle, rightTitle} = props;
  return (
    <Flex
      pl={'25px'}
      pr={'20px'}
      h={'60px'}
      alignItems="center"
      justifyContent={'space-between'}
      borderBottom={'solid 1px #e6eaee'}
      fontWeight={600}>
      <Text fontSize={14}>{leftTitle}</Text>
      <Text>{rightTitle}</Text>
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
}) => {
  const {
    leftTitle,
    rightTitle,
    isLast,
    percent,
    isEdit,
    isSecondColData,
    formikName,
  } = props;
  const [inputVal, setInputVal] = useState(rightTitle?.replaceAll(' TON', ''));

  useEffect(() => {
    setInputVal(rightTitle?.replaceAll(' TON', ''));
  }, [isEdit, rightTitle]);

  const tokensRef = useRef();
  const [dateRange, setDateRange] = useState([]);
  const [claimDate, setClaimDate] = useState<number>(0);

  return (
    <Flex
      pl={'25px'}
      pr={'20px'}
      h={'60px'}
      alignItems="center"
      justifyContent={'space-between'}
      borderBottom={isLast ? '' : 'solid 1px #e6eaee'}
      fontWeight={600}>
      <Text color={'#7e8993'} w={'101px'}>
        {leftTitle}
      </Text>

      {isEdit ? (
        isSecondColData ? (
          <Flex>
            <Flex flexDir={'column'} textAlign={'right'} mr={'8px'}>
              <Text>{rightTitle?.split('~')[0] || '-'}</Text>
              <Text>
                {rightTitle?.split('~')[1]
                  ? `~ ${rightTitle?.split('~')[1]}`
                  : ''}
              </Text>
            </Flex>
            {rightTitle?.split('~')[1] ? (
              <DoubleCalendarPop setDate={setDateRange}></DoubleCalendarPop>
            ) : (
              <SingleCalendarPop setDate={setClaimDate}></SingleCalendarPop>
            )}
            <Text>
              {dateRange[0]} {dateRange[1]}
            </Text>
          </Flex>
        ) : (
          <InputField
            w={120}
            h={32}
            fontSize={13}
            value={inputVal}
            setValue={setInputVal}
            formikName={formikName}></InputField>
        )
      ) : rightTitle?.includes('~') ? (
        <Flex flexDir={'column'} textAlign={'right'}>
          <Text>{rightTitle.split('~')[0]}</Text>
          <Text>~ {rightTitle.split('~')[1]}</Text>
        </Flex>
      ) : (
        <Flex>
          <Text textAlign={'right'}>
            {rightTitle?.includes('undefined')
              ? '-'
              : rightTitle && rightTitle.length > 20
              ? shortenAddress(rightTitle as string)
              : rightTitle || '-'}
          </Text>
          {percent !== undefined && (
            <Text ml={'5px'} color={'#7e8993'} textAlign={'right'}>
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
}) => {
  const {tier, requiredTos, allocatedToken, isLast, isEdit} = props;
  const [inputVal, setInputVal] = useState(requiredTos);
  const [inputVal2, setInputVal2] = useState(allocatedToken);

  // useEffect(() => {
  //   setInputVal(inputVal);
  // }, [isEdit, props]);

  return (
    <Flex
      h={'60px'}
      alignItems="center"
      textAlign={'center'}
      borderBottom={isLast ? '' : 'solid 1px #e6eaee'}
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
              stosTierLevel={Number(tier) as 1 | 2 | 3 | 4}></InputField>
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
              formikName={'allocatedToken'}></InputField>
          </Flex>
        </>
      ) : (
        <>
          <Text w={'125px'}>{requiredTos || '-'}</Text>
          <Text w={'137px'}>{allocatedToken || '-'}</Text>
        </>
      )}
    </Flex>
  );
};

const PublicTokenDetail = (props: {
  firstColData: PublicTokenColData['firstColData'] | null;
  secondColData: PublicTokenColData['secondColData'] | null;
  thirdColData: PublicTokenColData['thirdColData'] | null;
  isEdit: boolean;
}) => {
  const theme = useTheme();
  //@ts-ignore
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  const {firstColData, secondColData, thirdColData, isEdit} = props;
  const {
    values: {vaults},
  } = useFormikContext<Projects['CreateProject']>();
  // const publicVaultValue = vaults.filter((vault: VaultCommon) => {
  //   return vault.vaultName === 'Public';
  // });
  const {selectedVaultDetail} = useVaultSelector();

  return (
    <Grid
      {...OpenCampaginDesign.border({colorMode})}
      w={'100%'}
      templateColumns="repeat(3, 1fr)"
      fontSize={13}>
      <GridItem>
        <MainTitle
          leftTitle="Token"
          rightTitle={`${commafy(
            selectedVaultDetail?.vaultTokenAllocation,
          )} TON`}></MainTitle>
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
                rightTitle={content}
                isLast={index + 1 === firstColData.length}
                percent={percent}
                isEdit={isEdit}
                formikName={formikName}></SubTitle>
            );
          },
        )}
        {firstColData === null && (
          <Flex
            alignItems={'center'}
            justifyContent="center"
            h={'60px'}
            fontSize={13}
            color={'#808992'}
            fontWeight={600}>
            <Text>There is no Token value.</Text>
          </Flex>
        )}
      </GridItem>
      <GridItem borderX={'solid 1px #e6eaee'}>
        <MainTitle leftTitle="Schedule" rightTitle="KST"></MainTitle>
        {secondColData?.map(
          (data: {title: string; content: string; formikName: string}) => {
            const {title, content, formikName} = data;
            return (
              <SubTitle
                key={title}
                leftTitle={title}
                rightTitle={content}
                isEdit={isEdit}
                isSecondColData={true}
                formikName={formikName}></SubTitle>
            );
          },
        )}
        {secondColData === null && (
          <Flex
            alignItems={'center'}
            justifyContent="center"
            h={'60px'}
            fontSize={13}
            color={'#808992'}
            fontWeight={600}>
            <Text>There is no Schedule value.</Text>
          </Flex>
        )}
      </GridItem>
      <GridItem>
        <MainTitle leftTitle="sTOS Tier" rightTitle=""></MainTitle>
        {thirdColData && (
          <Flex
            h={'60px'}
            alignItems="center"
            textAlign={'center'}
            borderBottom={'solid 1px #e6eaee'}
            fontWeight={600}
            color={'#7e8993'}
            fontSize={13}>
            <Text w={'80px'}>Tier</Text>
            <Text w={'125px'}>Required TOS</Text>
            <Text w={'137px'}>Allocated Token</Text>
          </Flex>
        )}
        {thirdColData?.map((data: any, index: number) => {
          const {tier, requiredTos, allocatedToken} = data;
          return (
            <STOSTier
              key={tier}
              tier={tier}
              requiredTos={requiredTos}
              allocatedToken={allocatedToken}
              isLast={index + 1 === thirdColData.length}
              isEdit={isEdit}></STOSTier>
          );
        })}
        {thirdColData === null && (
          <Flex
            alignItems={'center'}
            justifyContent="center"
            h={'60px'}
            fontSize={13}
            color={'#808992'}
            fontWeight={600}>
            <Text>There is no sTOS Tier value.</Text>
          </Flex>
        )}
      </GridItem>
    </Grid>
  );
};

const TokenDetail = (props: {isEdit: boolean}) => {
  const {isEdit} = props;
  const {
    data: {selectedVault},
  } = useAppSelector(selectLaunch);

  const {publicTokenColData} = useTokenDetail();
  const VaultTokenDetail = useMemo(() => {
    switch (selectedVault) {
      case 'Public':
        if (publicTokenColData) {
          return (
            <PublicTokenDetail
              firstColData={publicTokenColData.firstColData}
              secondColData={publicTokenColData.secondColData}
              thirdColData={publicTokenColData.thirdColData}
              isEdit={isEdit}></PublicTokenDetail>
          );
        }
        return null;
      case 'Initial Liquidity':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}></PublicTokenDetail>
        );
      case 'TON Staker':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}></PublicTokenDetail>
        );
      case 'TOS Staker':
        return (
          <PublicTokenDetail
            firstColData={null}
            secondColData={null}
            thirdColData={null}
            isEdit={isEdit}></PublicTokenDetail>
        );
      case 'WTON-TOS LP Reward':
        return <Flex>go</Flex>;
      default:
        return <>no container for this vault :(</>;
    }
  }, [selectedVault, isEdit, publicTokenColData]);

  const VaultTokenDetailEdit = useMemo(() => {
    switch (selectedVault) {
      case 'Public':
        return <Flex>public</Flex>;
      case 'LP':
        return <Flex>go</Flex>;
      case 'TON Staker':
        return <Flex>go</Flex>;
      case 'TOS Staker':
        return <Flex>go</Flex>;
      case 'WTON-TOS LP Reward':
        return <Flex>go</Flex>;
      default:
        return <>no container for this vault :(</>;
    }
  }, [selectedVault]);

  return VaultTokenDetail;

  //   return <>{isEdit ? VaultTokenDetailEdit : VaultTokenDetail}</>;
};

export default TokenDetail;
