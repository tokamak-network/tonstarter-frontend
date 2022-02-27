import {Box, Button, Flex, useTheme} from '@chakra-ui/react';
import {useCallback, useState} from 'react';
import OpenStepOne from '@Launch/components/OpenStepOne';
import {Formik, Form} from 'formik';
import useValues from './hooks/useValues';
import type {StepNumber} from '@Launch/types';
import ProjectSchema from '@Launch/utils/projectSchema';
import {errors} from 'ethers';
import {PageHeader} from 'components/PageHeader';
import Steps from '@Launch/components/Steps';
import OpenStepTwo from './components/OpenStepTwo';

const MainScreen = () => {
  const [step, setStep] = useState<StepNumber>(1);
  const {initialValues, setInitialValues} = useValues();
  const theme = useTheme();

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

  const StepComponent = (props: {step: StepNumber}) => {
    const {step} = props;
    switch (step) {
      case 1:
        return <OpenStepOne></OpenStepOne>;
      case 2:
        return <OpenStepTwo></OpenStepTwo>;
      // case 3:
      //   break;
      default:
        return <div>no component for this step</div>;
    }
  };

  const [isDisable, setDisable] = useState<boolean>(true);

  return (
    <Flex flexDir={'column'}>
      <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
        <PageHeader
          title={'Create Project'}
          subtitle={'You can create  and manage projects.'}
        />
        <Flex mt={'50px'} mb={'20px'}>
          <Steps
            stepName={['Project&Token', 'Token Economy', 'Deploy']}
            currentStep={step}></Steps>
        </Flex>
      </Flex>
      <Formik
        initialValues={initialValues}
        validationSchema={ProjectSchema}
        validate={(values) => {
          console.log(values);
          if (values.tokenName === '1') {
            console.log('error');
            return errors;
          }
        }}
        onSubmit={async (data, {setSubmitting}) => {
          setSubmitting(true);
          console.log(data);
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
                <Box mt={10} fontSize={14}>
                  {step !== 1 && (
                    <Button
                      type="submit"
                      w={'180px'}
                      h={'35px'}
                      bg={isDisable ? '#gray.25' : 'blue.500'}
                      // disabled={isDisable || isSubmitting}
                      disabled={isSubmitting}
                      onClick={() => handleStep(false)}>
                      Prev
                    </Button>
                  )}
                  {step !== 3 && (
                    <Button
                      type="submit"
                      w={'180px'}
                      h={'35px'}
                      bg={isDisable ? '#gray.25' : 'blue.500'}
                      // disabled={isDisable || isSubmitting}
                      disabled={isSubmitting}
                      onClick={() => handleStep(true)}>
                      Next
                    </Button>
                  )}
                </Box>
              </Flex>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default MainScreen;
