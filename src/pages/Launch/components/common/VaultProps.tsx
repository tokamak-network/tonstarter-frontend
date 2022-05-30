import {Box, Flex, Input, Text} from '@chakra-ui/react';
import {Projects, VaultName, VaultPublic} from '@Launch/types';
import {useFormikContext} from 'formik';

const VaultPropTitle = (props: {title: string}) => {
  const {title} = props;
  return <Text>{title}</Text>;
};

const PublicProps = () => {
  const vaultName: VaultName = 'Public';
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  // console.log('--go--');
  // console.log(values);
  //@ts-ignore
  const publicVaultValue: VaultPublic = values.vaults[0];
  const {whitelist, publicRound1, publicRound2, claimStart, stosTier} =
    publicVaultValue;

  return (
    <Flex flexDir={'column'} w={'100%'}>
      {whitelist}
    </Flex>
  );
};

const LPProps = () => {
  return <Flex></Flex>;
};

const TONStakerProps = () => {
  return <Flex></Flex>;
};

const TOSStakerProps = () => {
  return <Flex></Flex>;
};

const RewardProps = () => {
  return <Flex></Flex>;
};

const VaultCProps = () => {
  return <Flex></Flex>;
};

export {
  PublicProps,
  LPProps,
  TONStakerProps,
  TOSStakerProps,
  RewardProps,
  VaultCProps,
};
