import {Flex, useColorMode, useTheme} from '@chakra-ui/react';
import {useEffect, useState} from 'react';

type StepTwoStepsProps = {
  stepNames: string[];
  currentStep: number;
};

const StepTwoSteps: React.FC<StepTwoStepsProps> = (props) => {
  const {stepNames, currentStep} = props;
  const [maxStep, setStepMax] = useState(0);
  const {colorMode} = useColorMode();

  useEffect(() => {
    if (currentStep > maxStep) {
      setStepMax(currentStep);
    }
  }, [currentStep, maxStep]);

  return (
    <Flex>
      {stepNames.map((step: string, index: number) => {
        return (
          <Flex alignItems={'center'} key={index}>
            <Flex
              h="8px"
              w="8px"
              borderRadius={'50%'}
              bg={Number(currentStep) === index ? 'blue.100' : 'transparent'}
              border={
                Number(currentStep) === index
                  ? 'none'
                  : colorMode === 'dark'
                  ? '1px solid #353d48'
                  : '1px solid #e6eaee'
              }></Flex>
            {index !== 3 ? (
              <Flex
                w="12px"
                h="2px"
                bg={colorMode === 'dark' ? '#353d48' : '#e6eaee'}></Flex>
            ) : (
              <></>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default StepTwoSteps;
