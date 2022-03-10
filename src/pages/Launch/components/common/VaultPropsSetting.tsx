import {Box, Flex, Input, Text} from '@chakra-ui/react';
import {VaultName} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useState} from 'react';

const VaultPropTitle = (props: {title: string}) => {
  const {title} = props;
  return <Text>{title}</Text>;
};

const VaultPropInput = (props: {placeHolder: string; filedName: string}) => {
  const {placeHolder, filedName} = props;
  return <Input w={'150px'} placeholder={placeHolder}></Input>;
};

const PublicPropsSetting = () => {
  const vaultName: VaultName = 'Public';
  const {values, setFieldValue} = useFormikContext();
  console.log(values);

  return (
    <Flex flexDir={'column'} w={'100%'}>
      <Box d="flex" justifyContent={'space-between'}>
        <VaultPropTitle title={'Token'}></VaultPropTitle>
        <VaultPropInput
          placeHolder={'Token'}
          filedName={vaultName}></VaultPropInput>
      </Box>
      <Box d="flex" justifyContent={'space-between'}></Box>
      <Box d="flex" justifyContent={'space-between'}></Box>
      <Box d="flex" justifyContent={'space-between'}></Box>
    </Flex>
  );
};

const LPPropsSetting = () => {
  return <Flex></Flex>;
};

const TONStakerPropsSetting = () => {
  return <Flex></Flex>;
};

const TOSStakerPropsSetting = () => {
  return <Flex></Flex>;
};

const RewardPropsSetting = () => {
  return <Flex></Flex>;
};

export {
  PublicPropsSetting,
  LPPropsSetting,
  TONStakerPropsSetting,
  TOSStakerPropsSetting,
  RewardPropsSetting,
};
