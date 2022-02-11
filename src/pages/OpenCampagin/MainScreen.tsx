import {Box, Button, Flex} from '@chakra-ui/react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import OpenStepOne from '@OpenCampagin/components/OpenStepOne';
import {Formik, Field, Form} from 'formik';
import useValues from './hooks/useValues';
import type {Projects, StepNumber} from '@OpenCampagin/types';
import {errors} from 'ethers';
import * as Yup from 'yup';

const MainScreen = () => {
  const [step, setStep] = useState<StepNumber>(1);

  const {initialValues, setInitialValues} = useValues();

  const handleStep = useCallback(
    (isNext: boolean) => {
      const prevStepNum =
        step - 1 > 0 ? ((step - 1) as StepNumber) : (step as StepNumber);
      const nextStepNum =
        step + 1 < 6 ? ((step + 1) as StepNumber) : (step as StepNumber);
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
    tokenName: Yup.string()
      .min(2, 'Too Short!')
      .max(70, 'Too Long!')
      .required('Required'),
  });

  const [isDisable, setDisable] = useState<boolean>(true);

  return (
    <Flex flexDir={'column'} w={'100%'}>
      <Formik
        initialValues={initialValues}
        validationSchema={SignupSchema}
        validate={(values) => {
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
              <Flex flexDir={'column'} alignItems="center">
                <StepComponent step={step} />
                <Box mt={10} fontSize={14}>
                  {step !== 1 && (
                    <Button
                      type="submit"
                      w={'180px'}
                      h={'35px'}
                      bg={isDisable ? '#gray.25' : 'blue.500'}
                      disabled={isDisable || isSubmitting}
                      onClick={() => handleStep(false)}>
                      Prev
                    </Button>
                  )}
                  {step !== 4 && (
                    <Button
                      type="submit"
                      w={'180px'}
                      h={'35px'}
                      bg={isDisable ? '#gray.25' : 'blue.500'}
                      disabled={isDisable || isSubmitting}
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
