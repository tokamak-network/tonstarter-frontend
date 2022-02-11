import {Flex, useTheme, Box, Grid, GridItem} from '@chakra-ui/react';
import {useEffect} from 'react';
import type {Projects} from '@OpenCampagin/types';
import InputComponent from '@OpenCampagin/components/common/InputComponent';
import StepTitle from '@OpenCampagin/components/common/StepTitle';
import Line from '@OpenCampagin/components/common/Line';
import MarkdownEditor from '@OpenCampagin/components/MarkdownEditor';

const filedNameList = [
  'projectName',
  'description',
  'tokenName',
  'tokenSymbol',
  'totalSupply',
];

const OpenStepOne = () => {
  const {theme} = useTheme();
  return (
    <Flex p={'35px'} pt={'24px'} w={'774px'} bg={'white.100'} flexDir="column">
      <Box mb={'23px'}>
        <StepTitle title={'Project&Token'}></StepTitle>
      </Box>
      <Box>
        <Line></Line>
      </Box>
      <Grid templateColumns="repeat(2, 1fr)">
        {filedNameList.map((name: string, index: number) => {
          return (
            <GridItem
              w={'327px'}
              justifySelf={index % 2 !== 0 || index === 4 ? 'flex-end' : ''}>
              <InputComponent
                name={name}
                placeHolder={`input ${name}`}
                key={name}></InputComponent>
            </GridItem>
          );
        })}
      </Grid>
      <Box>
        <MarkdownEditor></MarkdownEditor>
      </Box>
    </Flex>
  );
};

export default OpenStepOne;
