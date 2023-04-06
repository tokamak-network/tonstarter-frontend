import {Flex, Button, useTheme, useColorMode} from '@chakra-ui/react';
import {useState, useCallback} from 'react';
import {TEconomyStepNumber} from '@Launch/types';
import StepTwoSteps from './StepTwoSteps';
import StepFour from './StepFour';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import Line from '@Launch/components/common/Line';
import DetailComponent from './DetailComponent';
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';

const StepComp = (props: {step: TEconomyStepNumber}) => {
  const {step} = props;
  switch (step) {
    case 0:
      return <StepOne />;
    case 1:
      return <StepTwo />;
   
    case 2:
      return <StepFour />;
  }
};

const StepComponent = () => {
  const [step, setStep] = useState<TEconomyStepNumber>(0);
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();

  console.log('values',values);

  const disableButton = (step: number) => {
    switch (step) {
      case 0: {
        return values.fundingTarget === undefined ||
          values.marketCap === undefined ||
          isNaN(values.marketCap) ||
          values.marketCap === 0
          ? true
          : false;
      }
      case 1: {
        return values.totalSupply === undefined ? true : false;
      }
     
    }
  };

  const handleStep = useCallback(
    (isNext: boolean) => {
      const prevStepNum =
        step - 1 > -1
          ? ((step - 1) as TEconomyStepNumber)
          : (step as TEconomyStepNumber);
      const nextStepNum =
        step + 1 < 4
          ? ((step + 1) as TEconomyStepNumber)
          : (step as TEconomyStepNumber);
      setStep(isNext ? nextStepNum : prevStepNum);
    },
    [step],
  );

  return (
    <Flex
      w="327px"
      flexDir={'column'}
      mt="40px"
      fontFamily={theme.fonts.roboto}>
      <Flex w="327px">
        <StepComp step={step} />
      </Flex>

      <Line />
      <Flex
        w="100%"
        justifyContent={'space-between'}
        mt="15px"
        alignItems={'center'}>
        <StepTwoSteps stepNames={['0', '1', '2']} currentStep={step} />
        <Flex>
          {step !== 0 && (
            <Button
              fontSize={'12px'}
              bg="transparent"
              color={'#2a72e5'}
              fontWeight="normal"
              h="25px"
              w="60px"
              _focus={{}}
              _active={{borderColor: '#2a72e5', color: '#2a72e5'}}
              _hover={{
                borderColor: '#2a72e5',
                color: '#fafbfc',
                background: '#2a72e5',
              }}
              onClick={() => handleStep(false)}
              border={'1px solid #2a72e5'}>
              Prev
            </Button>
          )}
          {step !== 2 && (
            <Button
              fontSize={'12px'}
              bg="transparent"
              color={'#2a72e5'}
              h="25px"
              w="60px"
              ml="9px"
              fontWeight="normal"
              //  _focus={{borderColor:'#2a72e5',color:'#2a72e5'}}
              _active={
                !disableButton(step)
                  ? {borderColor: '#2a72e5', color: '#2a72e5'}
                  : {}
              }
              _hover={
                !disableButton(step)
                  ? {
                      borderColor: '#2a72e5',
                      color: '#fafbfc',
                      background: '#2a72e5',
                    }
                  : {}
              }
              _disabled={{
                borderColor: colorMode === 'dark' ? '#535353' : '#dfe4ee',
                color: colorMode === 'dark' ? '#818181' : '#86929d',
                cursor: 'not-allowed',
              }}
              isDisabled={disableButton(step)}
              onClick={() => handleStep(true)}
              border={'1px solid #2a72e5'}>
              Next
            </Button>
          )}
        </Flex>
      </Flex>

      <DetailComponent />
    </Flex>
  );
};

export default StepComponent;
