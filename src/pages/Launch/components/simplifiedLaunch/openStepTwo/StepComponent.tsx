import {Flex, Button, useTheme} from '@chakra-ui/react';
import { useState, useCallback} from 'react';
import {TEconomyStepNumber} from '@Launch/types';
import StepTwoSteps from './StepTwoSteps';
import StepFour from './StepFour';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import Line from '@Launch/components/common/Line';
import DetailComponent from './DetailComponent';

const StepComp = (props: {step: TEconomyStepNumber}) => {
  const {step} = props;
  switch (step) {
    case 0:
      return <StepOne />;
    case 1:
      return <StepTwo />;
    case 2:
      return <StepThree />;
    case 3:
      return <StepFour />;
  }
};

const StepComponent = () => {
  const [step, setStep] = useState<TEconomyStepNumber>(0);
  const theme = useTheme();

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
        <Flex   w="327px">
        <StepComp step={step} />
        </Flex>
   
      <Line />
      <Flex w="100%" justifyContent={'space-between'} mt='15px' alignItems={'center'}>
        <StepTwoSteps stepNames={['0', '1', '2', '3']} currentStep={step} />
      <Flex>
        {step !== 0 && (
                <Button
                fontSize={'12px'}
                bg="transparent"
                color="#2a72e5"
                h="25px"
                w="60px"
                _active={{}}
                _hover={{}}
                _focus={{}}
                onClick={() => handleStep(false)}
                border="1px solid #2a72e5">
                
                Prev
              </Button>
        )}
        <Button
          fontSize={'12px'}
          bg="transparent"
          color="#2a72e5"
          h="25px"
          w="60px"
          ml='9px'
          _active={{}}
          _hover={{}}
          _focus={{}}
          onClick={() => handleStep(true)}
          border="1px solid #2a72e5">
          Next
        </Button>
        </Flex>
      </Flex>

<DetailComponent />
    </Flex>
  );
};

export default StepComponent;
