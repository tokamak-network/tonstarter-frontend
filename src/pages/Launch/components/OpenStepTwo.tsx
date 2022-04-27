import {Flex, Box, useColorMode} from '@chakra-ui/react';
import Line from '@Launch/components/common/Line';
import Vaults from '@Launch/components/stepTwo/Vaults';
import Middle from '@Launch/components/stepTwo/Middle';
import LaunchVaultPropModal from '@Launch/components/modals/VaultProps';
import PieChartModal from '@Launch/components/modals/PieChartModal';
import CreateVaultModal from '@Launch/components/modals/CreateVault';
import VaultBasicSetting from '@Launch/components/modals/VaultBasicSetting';
import TopTitle from '@Launch/components/stepTwo/TopTitle';
import ClaimRound from '@Launch/components/stepTwo/ClaimRound';
import Overview from '@Launch/components/stepTwo/Overview';

const OpenStepTwo = () => {
  const {colorMode} = useColorMode();
  return (
    <Flex
      w={'1100px'}
      bg={colorMode === 'light' ? 'white.100' : 'none'}
      border={colorMode === 'light' ? '' : '1px solid #373737'}
      borderRadius={'10px'}
      flexDir="column">
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
      <Flex px={'35px'} pb={'35px'}>
        <Overview></Overview>
      </Flex>
      <VaultBasicSetting></VaultBasicSetting>
      <LaunchVaultPropModal></LaunchVaultPropModal>
      <CreateVaultModal></CreateVaultModal>
      <PieChartModal></PieChartModal>
    </Flex>
  );
};

export default OpenStepTwo;
