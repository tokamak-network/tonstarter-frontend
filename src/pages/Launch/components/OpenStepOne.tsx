import {Flex, Box, Grid, GridItem, useColorMode} from '@chakra-ui/react';
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
  // 'projectMainImage',
  // 'tokenSymbolImage',
  // 'website',
  // 'totalSupply',
  // 'medium',
  // 'telegram',
  // 'twitter',
  // 'discord',
];

const OpenStepOne = () => {
  const {colorMode} = useColorMode();
  return (
    <Flex
      p={'35px'}
      pt={'24px'}
      w={'774px'}
      bg={colorMode === 'light' ? 'white.100' : 'none'}
      borderRadius={'10px'}
      border={colorMode === 'light' ? '' : '1px solid #373737'}
      flexDir="column">
      <Box mb={'23px'}>
        <StepTitle title={'Project & Token'} isSaveButton={false}></StepTitle>
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
