import {Flex, Grid, GridItem, Text, useColorMode} from '@chakra-ui/react';
import {useTheme} from '@emotion/react';
import useTokenDetail from '@Launch/hooks/useTokenDetail';
import {selectLaunch} from '@Launch/launch.reducer';
import {Projects, PublicTokenColData, VaultCommon} from '@Launch/types';
import {CustomInput} from 'components/Basic';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect, useMemo, useState} from 'react';
import InputField from './InputField';

const MainTitle = (props: {leftTitle: string; rightTitle: string}) => {
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
  rightTitle: string;
  isLast?: boolean;
  percent?: number;
  isEdit: boolean;
}) => {
  const {leftTitle, rightTitle, isLast, percent, isEdit} = props;
  const [inputVal, setInputVal] = useState(rightTitle.replaceAll(' TON', ''));

  useEffect(() => {
    setInputVal(rightTitle.replaceAll(' TON', ''));
  }, [isEdit, rightTitle]);

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
        <InputField
          w={120}
          h={32}
          fontSize={13}
          value={inputVal}
          setValue={setInputVal}></InputField>
      ) : rightTitle.includes('~') ? (
        <Flex flexDir={'column'} textAlign={'right'}>
          <Text>{rightTitle.split('~')[0]}</Text>
          <Text>~ {rightTitle.split('~')[1]}</Text>
        </Flex>
      ) : (
        <Flex>
          <Text textAlign={'right'}>{rightTitle}</Text>
          {percent !== undefined && (
            <Text ml={'5px'} color={'#7e8993'} textAlign={'right'}>
              {`(${percent}%)`}
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  );
};

const STOSTier = (props: {
  tier: string;
  requiredTos: number;
  allocatedToken: number;
  isLast?: boolean;
}) => {
  const {tier, requiredTos, allocatedToken, isLast} = props;

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
      <Text w={'125px'}>{requiredTos}</Text>
      <Text w={'137px'}>{allocatedToken}</Text>
    </Flex>
  );
};

const PublicTokenDetail = (props: {
  firstColData: PublicTokenColData['firstColData'];
  secondColData: PublicTokenColData['secondColData'];
  thirdColData: PublicTokenColData['thirdColData'];
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
  const publicVaultValue = vaults.filter((vault: VaultCommon) => {
    return vault.vaultName === 'Public';
  });

  return (
    <Grid
      {...OpenCampaginDesign.border({colorMode})}
      w={'100%'}
      templateColumns="repeat(3, 1fr)"
      fontSize={13}>
      <GridItem>
        <MainTitle
          leftTitle="Token"
          rightTitle={`${publicVaultValue[0].vaultTokenAllocation} TON`}></MainTitle>
        {firstColData.map(
          (
            data: {title: string; content: string; percent?: number},
            index: number,
          ) => {
            const {title, content, percent} = data;
            return (
              <SubTitle
                key={title}
                leftTitle={title}
                rightTitle={content}
                isLast={index + 1 === firstColData.length}
                percent={percent}
                isEdit={isEdit}></SubTitle>
            );
          },
        )}
      </GridItem>
      <GridItem borderX={'solid 1px #e6eaee'}>
        <MainTitle leftTitle="Schedule" rightTitle="KST"></MainTitle>
        {secondColData.map((data: {title: string; content: string}) => {
          const {title, content} = data;
          return (
            <SubTitle
              key={title}
              leftTitle={title}
              rightTitle={content}
              isEdit={isEdit}></SubTitle>
          );
        })}
      </GridItem>
      <GridItem>
        <MainTitle leftTitle="sTOS Tier" rightTitle=""></MainTitle>
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
        {thirdColData.map((data: any, index: number) => {
          const {tier, requiredTos, allocatedToken} = data;
          return (
            <STOSTier
              key={tier}
              tier={tier}
              requiredTos={requiredTos}
              allocatedToken={allocatedToken}
              isLast={index + 1 === thirdColData.length}></STOSTier>
          );
        })}
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
