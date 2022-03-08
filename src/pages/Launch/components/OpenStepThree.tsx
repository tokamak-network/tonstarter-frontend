import {Flex, Box} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import Line from '@Launch/components/common/Line';
import DeployContainer from '@Launch/components/stepThree/DeployContainer';
import ConfirmTokenModal from './modals/ConfirmToken';
import ConfirmVaultModal from './modals/ConfirmVault';

const OpenStepThree = () => {
  return (
    <Flex
      pt={'24px'}
      pb={'35px'}
      w={'1110px'}
      bg={'white.100'}
      flexDir="column">
      <Box mb={'23px'} pl={'35px'}>
        <StepTitle title={'Deploy'}></StepTitle>
      </Box>
      <Box mb={'40px'}>
        <Line></Line>
      </Box>
      <DeployContainer></DeployContainer>
      <ConfirmTokenModal></ConfirmTokenModal>
      <ConfirmVaultModal></ConfirmVaultModal>
    </Flex>
  );
};

export default OpenStepThree;
