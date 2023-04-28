import {Flex, Box, Grid, GridItem, Text, useColorMode} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import {testValue} from '@Launch/utils/testValue';
import {LaunchSchedule} from './openStepOne/LaunchSchedule';
import {TokenImageInput} from './openStepOne/TokenImageInput';
import CustomMarkdownEditor from './openStepOne/CustomMarkdownEditor';
import validateSimplifiedFormikValues from '@Launch/utils/validateSimplified';
import StepHeader from './StepHeader';
import TextInput from './openStepOne/TextInput';
import {useAppDispatch} from 'hooks/useRedux';
import {setProjectStep, saveTempProjectData,selectLaunch} from '@Launch/launch.reducer';
import store from 'store';
import { useAppSelector} from 'hooks/useRedux';

const filedNameList = [
  {title: 'projectName', requirement: true},
  {title: 'tokenName', requirement: true},
  {title: 'tokenSymbol', requirement: true},
  {title: 'tokenSymbolImage', requirement: false},
];

const OpenStepOneSimplified = (props: any) => {
  const {step, setDisableForStep1} = props;
  const {colorMode} = useColorMode();
  const dispatch: any = useAppDispatch();
  const starterData = store.getState().starters.data;
  const [listed, setListed] = useState(false);
  const {
    data: {projects, hashKey, projectStep},
  } = useAppSelector(selectLaunch);

  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const testvalues = testValue();

  useEffect(() => {
    const {resultsStep1} = validateSimplifiedFormikValues(values);

    const validation = resultsStep1.length > 0 ? false : true;
    setDisableForStep1(!validation);
  }, [values, setDisableForStep1]);

  useEffect(() => {
    dispatch(setProjectStep({data: 1}));
  }, [dispatch]);


  useEffect(() => {
    dispatch(saveTempProjectData({data: values}));
    setFieldValue('isSimplified',true )
  },[values])
    
  useEffect(() => {
    if (hashKey !== undefined) {
      const inStarter = starterData.rawData.some(
        (el) => el.projectKey === hashKey,
      );
      setListed(inStarter);
    } else {
      setListed(false);
    }
  }, [hashKey, starterData.rawData]);


  return (
    <Flex
      w={'774px'}
      // h={'710px'}
      bg={colorMode === 'light' ? 'white.100' : 'none'}
      borderRadius={'10px'}
      border={colorMode === 'light' ? '' : '1px solid #373737'}
      flexDir="column">
      <StepHeader deploySteps={false} title={'Project & Token'} />
      <Grid px={'35px'} pb={'35px'}>
        <Flex fontSize={12} mt={'14px'} ml={'615px'}>
          <Text mr={'5px'} color={'#FF3B3B'}>
            *
          </Text>
          Required Field
        </Flex>
        <Grid
          templateColumns="repeat(2, 1fr)"
          rowGap={'20px'}
          columnGap={'50px'}>
          {filedNameList.map(
            (
              fieldName: {title: string; requirement: boolean},
              index: number,
            ) => {
              if (fieldName.title === 'tokenName') {
                return (
                  <Grid w={'212px'}   key={index}>
                    <TextInput
                  disabled={values.isTokenDeployed}
                      name={fieldName.title}
                      placeHolder={`input ${fieldName.title}`}
                      key={fieldName.title}
                      requirement={fieldName.requirement}></TextInput>
                  </Grid>
                );
              }
              if (fieldName.title === 'tokenSymbolImage') {
                return (
                  <Grid templateColumns="repeat(2, 1fr)"   key={index}>
                    <Box w={'212px'}>
                      <TextInput
                        disabled={false}
                        name={fieldName.title}
                        placeHolder={`input ${fieldName.title}`}
                        key={fieldName.title}></TextInput>
                    </Box>
                    <Box ml={'35px'} mt={'-36px'}>
                      <TokenImageInput imageLink={values.tokenSymbolImage} />
                    </Box>
                  </Grid>
                );
              }
              return (
                <GridItem w={'327px'}   key={index}>
                  <TextInput
                    disabled={fieldName.title === 'projectName'?listed: values.isTokenDeployed}
                    name={fieldName.title}
                    placeHolder={`input ${fieldName.title}`}
                    key={fieldName.title}
                    requirement={fieldName.requirement}></TextInput>
                </GridItem>
              );
            },
          )}
        </Grid>
        <Grid id="reschedule">
          <LaunchSchedule currentStep={step} isListed={listed}></LaunchSchedule>
        </Grid>
        <Box w={'704px'}>
          <CustomMarkdownEditor />
        </Box>
      </Grid>
    </Flex>
  );
};

export default OpenStepOneSimplified;
