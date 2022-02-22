import {Flex, useTheme, Box, Grid, GridItem} from '@chakra-ui/react';
import {useEffect} from 'react';
import type {Projects} from '@OpenCampagin/types';
import InputComponent from '@OpenCampagin/components/common/InputComponent';
import StepTitle from '@OpenCampagin/components/common/StepTitle';
import Line from '@OpenCampagin/components/common/Line';
import MarkdownEditor from '@OpenCampagin/components/MarkdownEditor';
import Vaults from '@OpenCampagin/components/stepTwo/Vaults';

const filedNameList = [
  'projectName',
  'tokenName',
  'owner',
  'tokenSymbol',
  'tokenSupply',
];

const OpenStepTwo = () => {
  const {theme} = useTheme();
  return (
    <Flex p={'35px'} pt={'24px'} w={'1110px'} bg={'white.100'} flexDir="column">
      <Box mb={'23px'}>
        <StepTitle title={'Token Economy'} isSaveButton={true}></StepTitle>
      </Box>
      <Box mb={'20px'}>
        <Line></Line>
      </Box>
      <Flex flexDir={'column'}>
        <Flex>
          <Vaults></Vaults>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default OpenStepTwo;
