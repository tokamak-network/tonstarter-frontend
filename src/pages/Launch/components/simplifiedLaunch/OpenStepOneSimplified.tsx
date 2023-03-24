import {Flex, Box, Grid, GridItem, Text, useColorMode} from '@chakra-ui/react';
import InputComponent from '@Launch/components/common/InputComponent';
import StepTitle from '@Launch/components/common/StepTitle';
import Line from '@Launch/components/common/Line';
import {useEffect} from 'react';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import {isProduction} from '@Launch/utils/checkConstants';
import {CustomButton} from 'components/Basic/CustomButton';
import {testValue} from '@Launch/utils/testValue';
import { LaunchSchedule } from '../common/simplifiedUI/LaunchSchedule';
import { UserGuideLink } from '../common/simplifiedUI/UserGuideLink';
import { TokenImageInput } from '../common/simplifiedUI/TokenImageInput';
import CustomMarkdownEditor from '../common/simplifiedUI/CustomMarkdownEditor';

const filedNameList = [
  {title: 'projectName', requirement: true},
  {title: 'tokenName', requirement: true},
  {title: 'tokenSymbol', requirement: true},
  {title: 'tokenSymbolImage', requirement: false},
];

const OpenStepOneSimplified = () => {
  const {colorMode} = useColorMode();
  const {values, setValues} = useFormikContext<Projects['CreateSimplifiedProject']>();
  console.log('useFormikValues', values);
  
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
          left={'300px'}>
          <CustomButton
            text="set a test value"
            //@ts-ignore
            func={() => setValues(testvalues)}></CustomButton>
        </Flex>
      )}
      <Box mb={'23px'}>
        <Flex>
          <StepTitle title={'Project & Token'} isSaveButton={false}></StepTitle>
          <UserGuideLink />
        </Flex>
      </Box>
      <Box pos="relative" >
        <Box w={'774px'} pos="absolute" left={'-35px'}>
          <Line></Line>
        </Box>
        <Box mt={'14px'} float={'right'}>
        <Flex fontSize={13}><Text mr={'5px'} color={'#FF3B3B'}>*</Text> Required Field</Flex>
        </Box>
      </Box>
      <Grid
        templateColumns="repeat(2, 1fr)"
        rowGap={'20px'}
        columnGap={'50px'}>
        {filedNameList.map(
          (fieldName: {title: string; requirement: boolean}, index: number) => {
            if (fieldName.title === 'tokenName') {
              return (
                <Grid w={'212px'}>
                  <InputComponent
                    name={fieldName.title}
                    placeHolder={`input ${fieldName.title}`}
                    key={fieldName.title}
                    requirement={fieldName.requirement}></InputComponent>
                </Grid>
              );
            }
            if (fieldName.title === 'tokenSymbolImage') {
              return (
                <Grid  templateColumns="repeat(2, 1fr)">
                  <Box w={'212px'}>
                    <InputComponent
                      name={fieldName.title}
                      placeHolder={`input ${fieldName.title}`}
                      key={fieldName.title}
                      requirement={fieldName.requirement}></InputComponent>
                  </Box>
                  <Box ml={'35px'} mt={'-36px'}>
                    <TokenImageInput
                      imageLink={values.tokenSymbolImage}
                    />
                  </Box>
                </Grid>
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
      <Grid>
        {/* Todo: get current step */}
        <LaunchSchedule stepNames={['Snapshot', 'Public Sale 1', 'Public Sale 2', 'Unlock 1', 'Unlock 2', 'Unlock 3']} currentStep={1}></LaunchSchedule>
      </Grid>
      <Box>
        <CustomMarkdownEditor />
      </Box>
    </Flex>
  );
};

export default OpenStepOneSimplified;
