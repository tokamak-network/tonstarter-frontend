import {Box, Button, Flex, useTheme} from '@chakra-ui/react';
import {useCallback, useEffect, useState} from 'react';
import OpenStepOne from '@Launch/components/OpenStepOne';
import {Formik, Form, useFormikContext} from 'formik';
import useValues from '@Launch/hooks/useValues';
import type {StepNumber} from '@Launch/types';
import ProjectSchema from '@Launch/utils/projectSchema';
import {PageHeader} from 'components/PageHeader';
import Steps from '@Launch/components/Steps';
import OpenStepTwo from '@Launch/components/OpenStepTwo';
import {useRouteMatch} from 'react-router-dom';
import {useAppSelector} from 'hooks/useRedux';
import {selectLaunch} from '@Launch/launch.reducer';
import OpenStepThree from '@Launch/components/OpenStepThree';
import validateFormikValues from '@Launch/utils/validate';
import {useHistory} from 'react-router-dom';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {saveProject, editProject} from '@Launch/utils/saveProject';

const StepComponent = (props: {step: StepNumber}) => {
  const {step} = props;
  switch (step) {
    case 1:
      return <OpenStepOne></OpenStepOne>;
    case 2:
      return <OpenStepTwo></OpenStepTwo>;
    case 3:
      return <OpenStepThree></OpenStepThree>;
    default:
      return <div>no component for this step</div>;
  }
};

const MainScreen = () => {
  const [step, setStep] = useState<StepNumber>(1);
  const [isDisable, setDisable] = useState<boolean>(false);
  const {initialValues, setInitialValues} = useValues();
  const theme = useTheme();
  const {account} = useActiveWeb3React();
  const match = useRouteMatch();
  const {url} = match;
  const isExist = url.split('/')[2];
  const {
    //@ts-ignore
    params: {id},
  } = match;
  const {
    data: {projects},
  } = useAppSelector(selectLaunch);

  // console.log('--gogo--');
  // console.log(id);
  // console.log(projects);

  // useEffect(() => {
  //   console.log(projects);
  // }, [projects]);

  let historyObj = useHistory();

  useEffect(() => {
    //@ts-ignore
    const unBlock = historyObj.block((loc, action) => {
      if (action === 'POP') {
        return window.confirm('Are you sure you want to go back?');
      }
    });
    return () => unBlock();
  }, [historyObj]);

  const handleStep = useCallback(
    (isNext: boolean) => {
      const prevStepNum =
        step - 1 > 0 ? ((step - 1) as StepNumber) : (step as StepNumber);
      const nextStepNum =
        step + 1 < 4 ? ((step + 1) as StepNumber) : (step as StepNumber);
      setStep(isNext ? nextStepNum : prevStepNum);
    },
    [step],
  );

  return (
    <Flex
      flexDir={'column'}
      justifyContent={'center'}
      w={'100%'}
      mt={100}
      mb={'100px'}>
      <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
        <PageHeader
          title={'Create Project'}
          subtitle={'You can create and manage projects.'}
        />
        <Flex mt={'50px'} mb={'20px'}>
          <Steps
            stepName={['Project&Token', 'Token Economy', 'Deploy']}
            currentStep={step}></Steps>
        </Flex>
      </Flex>
      <Formik
        initialValues={
          id && projects ? {...initialValues, ...projects[id]} : initialValues
        }
        validationSchema={ProjectSchema}
        validate={(values) => {
          validateFormikValues(values);
          console.log(values);
        }}
        onSubmit={async (data, {setSubmitting}) => {
          setSubmitting(true);
          setSubmitting(false);
        }}>
        {({values, handleBlur, handleSubmit, isSubmitting, errors}) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Flex
                flexDir={'column'}
                alignItems="center"
                fontFamily={theme.fonts.roboto}>
                <StepComponent step={step} />
                <Flex mt={'50px'} fontSize={14} justifyContent="center">
                  <Button
                    w={'160px'}
                    h={'45px'}
                    bg={'#00c3c4'}
                    color={'white.100'}
                    _hover={{}}
                    disabled={step === 3}
                    mr={step === 1 ? '390px' : '558px'}
                    onClick={() =>
                      account && isExist === 'createproject'
                        ? saveProject(values, account)
                        : editProject(values, account as string, isExist)
                    }>
                    Save
                  </Button>
                  <Flex>
                    {step !== 1 && (
                      <Button
                        type="submit"
                        w={'160px'}
                        h={'45px'}
                        bg={'blue.500'}
                        fontSize={14}
                        color={'white.100'}
                        mr={'12px'}
                        disabled={isSubmitting}
                        _hover={{}}
                        onClick={() => handleStep(false)}>
                        Prev
                      </Button>
                    )}
                    {step !== 3 && (
                      <Button
                        type="submit"
                        w={'160px'}
                        h={'45px'}
                        fontSize={14}
                        color={isDisable ? '#86929d' : 'white.100'}
                        bg={isDisable ? '#gray.25' : 'blue.500'}
                        // disabled={isDisable || isSubmitting}
                        disabled={isSubmitting}
                        _hover={{}}
                        onClick={() => handleStep(true)}>
                        Next
                      </Button>
                    )}
                    {step === 3 && (
                      <Button
                        type="submit"
                        w={'160px'}
                        h={'45px'}
                        fontSize={14}
                        color={isDisable ? '#86929d' : 'white.100'}
                        bg={isDisable ? '#gray.25' : 'blue.500'}
                        // disabled={isDisable || isSubmitting}
                        disabled={isSubmitting}
                        _hover={{}}
                        onClick={() => handleStep(true)}>
                        Confirm
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default MainScreen;
