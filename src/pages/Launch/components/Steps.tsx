import {Box, Flex} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import tickIcon from 'assets/svgs/tick-icon.svg';
import {StepComponent} from '@Admin/types';

const Steps: React.FC<StepComponent> = (props) => {
  const {stepName, currentStep} = props;
  const [maxStep, setStepMax] = useState(0);

  useEffect(() => {
    if (currentStep > maxStep) {
      setStepMax(currentStep);
    }
  }, [currentStep, maxStep]);

  return (
    <Flex>
      {stepName.map((step: string, index: number) => {
        const indexNum = index + 1;
        const isStep = currentStep === indexNum;
        const pastStep = currentStep > indexNum || maxStep > indexNum;

        return (
          <Box d="flex" mr={'20px'} alignItems="center" fontSize={14}>
            <Flex
              borderRadius={18}
              bg={isStep ? '#2ea1f8' : 'transparent'}
              w={'28px'}
              h={'28px'}
              alignItems="center"
              justifyContent="center"
              color={isStep ? 'white.100' : 'gray.575'}
              mr={'12px'}
              border={isStep ? '' : 'solid 1px #e6eaee'}>
              {pastStep && !isStep ? (
                <img src={tickIcon} alt={'tick_icon'} />
              ) : (
                <Box>{indexNum}</Box>
              )}
            </Flex>
            <Box>{step}</Box>
          </Box>
        );
      })}
    </Flex>
  );
};

export default Steps;
