import {Flex, Box} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import Line from '@Launch/components/common/Line';
import Vaults from '@Launch/components/stepTwo/Vaults';
import Middle from '@Launch/components/stepTwo/Middle';
import Bottom from '@Launch/components/stepTwo/Bottom';
import LaunchVaultPropModal from './modals/VaultProps';
import CreateVaultModal from './modals/CreateVault';

const OpenStepTwo = () => {
  return (
    <Flex w={'1110px'} bg={'white.100'} flexDir="column">
      <Box px={'24px'} py={'23px'}>
        <StepTitle title={'Token Economy'} isSaveButton={true}></StepTitle>
      </Box>
      <Box mb={'20px'}>
        <Line></Line>
      </Box>
      <Flex flexDir={'column'} px={'24px'}>
        <Flex>
          <Vaults></Vaults>
        </Flex>
      </Flex>
      <Box my={'25px'}>
        <Line></Line>
      </Box>
      <Flex px={'24px'}>
        <Middle></Middle>
      </Flex>
      <Box my={'25px'}>
        <Line></Line>
      </Box>
      <Flex px={'24px'} pb={'35px'}>
        <Bottom></Bottom>
      </Flex>
      <LaunchVaultPropModal></LaunchVaultPropModal>
      <CreateVaultModal></CreateVaultModal>
    </Flex>
  );
};

export default OpenStepTwo;
