import {Flex, useTheme, Box, Grid, GridItem} from '@chakra-ui/react';
import {useEffect} from 'react';
import type {Projects} from '@Launch/types';
import InputComponent from '@Launch/components/common/InputComponent';
import StepTitle from '@Launch/components/common/StepTitle';
import Line from '@Launch/components/common/Line';
import MarkdownEditor from '@Launch/components/MarkdownEditor';

const filedNameList = [
  'projectName',
  'tokenName',
  'owner',
  'tokenSymbol',
  'totalSupply',
];

const OpenStepOne = () => {
  const {theme} = useTheme();
  return (
    <Flex p={'35px'} pt={'24px'} w={'774px'} bg={'white.100'} flexDir="column">
      <Box mb={'23px'}>
        <StepTitle title={'Project&Token'} isSaveButton={true}></StepTitle>
      </Box>
      <Box mb={'40px'}>
        <Line></Line>
      </Box>
      <Grid
        templateColumns="repeat(2, 1fr)"
        rowGap={'20px'}
        columnGap={'50px'}
        mb={'20px'}>
        {filedNameList.map((name: string, index: number) => {
          return (
            <GridItem w={'327px'} colStart={index === 4 ? 2 : 0}>
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
