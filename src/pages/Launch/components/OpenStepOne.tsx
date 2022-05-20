import {Flex, Box, Grid, GridItem, useColorMode} from '@chakra-ui/react';
import InputComponent from '@Launch/components/common/InputComponent';
import StepTitle from '@Launch/components/common/StepTitle';
import Line from '@Launch/components/common/Line';
import MarkdownEditor from '@Launch/components/MarkdownEditor';
import {useEffect} from 'react';
import {TokenImage} from '@Admin/components/TokenImage';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';

const filedNameList = [
  {title: 'projectName', requirement: true},
  {title: 'tokenName', requirement: true},
  {title: 'owner', requirement: true},
  {title: 'tokenSymbol', requirement: true},
  {title: 'sector', requirement: true},
  {title: 'tokenSymbolImage', requirement: false},
  {title: 'website', requirement: false},
  {title: 'totalSupply', requirement: true},
  {title: 'medium', requirement: false},
  {title: 'telegram', requirement: false},
  {title: 'twitter', requirement: false},
  {title: 'discord', requirement: false},
];

const OpenStepOne = () => {
  const {colorMode} = useColorMode();
  const {values} = useFormikContext<Projects['CreateProject']>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <Box mb={'40px'} pos="relative">
        <Box w={'774px'} pos="absolute" left={'-35px'}>
          <Line></Line>
        </Box>
      </Box>
      <Grid
        templateColumns="repeat(2, 1fr)"
        rowGap={'20px'}
        columnGap={'50px'}
        mb={'20px'}>
        {filedNameList.map(
          (fieldName: {title: string; requirement: boolean}, index: number) => {
            console.log(fieldName);
            if (fieldName.title === 'tokenSymbolImage') {
              return (
                <Flex w={'327px'}>
                  <Box w={'280px'}>
                    <InputComponent
                      name={fieldName.title}
                      placeHolder={`input ${fieldName.title}`}
                      key={fieldName.title}
                      requirement={fieldName.requirement}></InputComponent>
                  </Box>
                  <Box mt={'11px'} ml={'10px'}>
                    <TokenImage
                      imageLink={values.tokenSymbolImage}></TokenImage>
                  </Box>
                </Flex>
              );
            }
            return (
              <GridItem w={'327px'}>
                <InputComponent
                  name={fieldName.title}
                  placeHolder={`input ${fieldName.title}`}
                  key={fieldName.title}
                  requirement={fieldName.requirement}></InputComponent>
              </GridItem>
            );
          },
        )}
      </Grid>
      <Box>
        <MarkdownEditor></MarkdownEditor>
      </Box>
    </Flex>
  );
};

export default OpenStepOne;
