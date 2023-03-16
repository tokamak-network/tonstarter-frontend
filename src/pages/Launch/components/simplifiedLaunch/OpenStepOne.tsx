import {Flex, Box, Grid, GridItem, useColorMode} from '@chakra-ui/react';
import InputComponent from '@Launch/components/common/InputComponent';
import StepTitle from '@Launch/components/common/StepTitle';
import Line from '@Launch/components/common/Line';
import MarkdownEditor from '@Launch/components/MarkdownEditor';
import {useEffect} from 'react';
import {TokenImage} from '@Admin/components/TokenImage';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import {isProduction} from '@Launch/utils/checkConstants';
import {CustomButton} from 'components/Basic/CustomButton';
import {testValue} from '@Launch/utils/testValue';

const filedNameList = [
  {title: 'projectName', requirement: true},
  {title: 'tokenName', requirement: true},
  {title: 'tokenSymbol', requirement: true},
  {title: 'tokenSymbolUrl', requirement: true},
  {title: 'tokenSymbolImage', requirement: false},
];

// TODO: 
const OpenStepOne = () => {
  const {colorMode} = useColorMode();
  const {values, setValues} = useFormikContext<Projects['CreateProject']>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const testvalues = testValue();

  return (
    <Flex
      p={'35px'}
      pt={'24px'}
      w={'774px'}
      bg={colorMode === 'light' ? 'white.100' : 'none'}
      borderRadius={'10px'}
      border={colorMode === 'light' ? '' : '1px solid #373737'}
      flexDir="column">
      {isProduction() === false && (
        <Flex
          justifyContent={'center'}
          pos="absolute"
          w={'100%'}
          h={'100%'}
          left={'300px'}>
          <CustomButton
            text="set a test value"
            //@ts-ignore
            func={() => setValues(testvalues)}></CustomButton>
        </Flex>
      )}
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
            if (fieldName.title === 'tokenType') {
              return (
                <GridItem
                  w={'100%'}
                  colSpan={
                    values.tokenType === 'B' || values.tokenType === 'C' ? 1 : 2
                  }>
                  <InputComponent
                    inputStyle={{w: '327px'}}
                    name={fieldName.title}
                    placeHolder={`input ${fieldName.title}`}
                    key={fieldName.title}
                    requirement={fieldName.requirement}></InputComponent>
                  <Box w={'100%'} mt={'22px'}>
                    <Line></Line>
                  </Box>
                </GridItem>
              );
            }
            if (fieldName.title === 'tokenOwnerAccount') {
              if (values.tokenType === 'B' || values.tokenType === 'C') {
                return (
                  <GridItem w={'327px'}>
                    <InputComponent
                      name={fieldName.title}
                      placeHolder={`input ${fieldName.title}`}
                      key={fieldName.title}
                      requirement={fieldName.requirement}></InputComponent>
                  </GridItem>
                );
              }
              return null;
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
