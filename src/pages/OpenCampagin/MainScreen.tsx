import {Box, Button, Flex} from '@chakra-ui/react';
import {useCallback, useState} from 'react';
import OpenStepOne from '@OpenCampagin/components/OpenStepOne';
import {Formik, Form} from 'formik';
import useValues from './hooks/useValues';
import type {StepNumber} from '@OpenCampagin/types';
import {errors} from 'ethers';
import * as Yup from 'yup';
import {PageHeader} from 'components/PageHeader';
import Steps from '@OpenCampagin/components/Steps';

const MainScreen = () => {
  const [step, setStep] = useState<StepNumber>(1);

  const {initialValues, setInitialValues} = useValues();

  const handleStep = useCallback(
    (isNext: boolean) => {
      const prevStepNum =
        step - 1 > 0 ? ((step - 1) as StepNumber) : (step as StepNumber);
      const nextStepNum =
        step + 1 < 5 ? ((step + 1) as StepNumber) : (step as StepNumber);
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
        return <div>step2</div>;
      // case 3:
      //   break;
      // case 4:
      //   break;
      // case 5:
      //   break;
      default:
        return <div>no component for this step</div>;
    }
  };

  const SignupSchema = Yup.object().shape({
    tokenName: Yup.string().required('Required'),
  });

  return (
    <Flex flexDir={'column'}>
      <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
        <PageHeader
          title={'Create Project'}
          subtitle={'You can create  and manage projects.'}
        />
        <Flex mt={'50px'} mb={'20px'}>
          <Steps
            stepName={['Project&Token', 'Token Economy', 'Overview', 'Deploy']}
            currentStep={step}></Steps>
        </Flex>
      </Flex>
      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
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
              <StepComponent step={step} />
              <Box mt={10}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => handleStep(false)}>
                  Prev
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => handleStep(true)}>
                  Next
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default MainScreen;
