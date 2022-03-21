import {Flex, Box} from '@chakra-ui/react';
import Line from '@Launch/components/common/Line';
import Vaults from '@Launch/components/stepTwo/Vaults';
import Middle from '@Launch/components/stepTwo/Middle';
import Bottom from '@Launch/components/stepTwo/Bottom';
import LaunchVaultPropModal from '@Launch/components/modals/VaultProps';
import CreateVaultModal from '@Launch/components/modals/CreateVault';
import VaultBasicSetting from '@Launch/components/modals/VaultBasicSetting';
import TopTitle from '@Launch/components/stepTwo/TopTitle';
import ClaimRound from '@Launch/components/stepTwo/ClaimRound';

const OpenStepTwo = () => {
  return (
    <Flex w={'1100px'} bg={'white.100'} flexDir="column">
      <TopTitle></TopTitle>
      <Box mb={'20px'}>
        <Line></Line>
      </Box>
      <Flex flexDir={'column'}>
        <Vaults></Vaults>
      </Flex>
      <Box my={'25px'}>
        <Line></Line>
      </Box>
      <Flex px={'35px'}>
        <Middle></Middle>
      </Flex>
      <Box my={'25px'}>
        <Line></Line>
      </Box>
      <Flex px={'35px'}>
        <ClaimRound></ClaimRound>
      </Flex>
      <Box my={'25px'}>
        <Line></Line>
      </Box>
      <Flex px={'24px'} pb={'35px'}>
        <Bottom></Bottom>
      </Flex>
      <VaultBasicSetting></VaultBasicSetting>
      <LaunchVaultPropModal></LaunchVaultPropModal>
      <CreateVaultModal></CreateVaultModal>
    </Flex>
  );
};

export default OpenStepTwo;
