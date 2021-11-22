import {
  Flex,
  Box,
  useColorMode,
  useTheme,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import {Dispatch, SetStateAction, useState, useEffect} from 'react';
import {AdminObject, StepComponent} from '@Admin/types';
import {StepOne, StepThree, StepTwo, StepFour} from './AdminStep';
import {createStarter} from '../utils/createStarter';
import {LibraryType} from 'types';

type AdminDetailProp = StepComponent & {
  setCurrentStep: Dispatch<SetStateAction<number>>;
  existingData: AdminObject[] | [];
  library: LibraryType;
  setFinal: Dispatch<SetStateAction<boolean>>;
};

const initialValue: AdminObject = {
  name: '',
  description: '',
  adminAddress: '',
  website: '',
  telegram: '',
  medium: '',
  twitter: '',
  discord: '',
  image: '',
  tokenName: '',
  tokenAddress: '',
  tokenSymbol: '',
  tokenSymbolImage: '',
  tokenAllocationAmount: '',
  tokenFundRaisingTargetAmount: '',
  fundingTokenType: 'TON',
  tokenFundingRecipient: '',
  projectTokenRatio: 0,
  projectFundingTokenRatio: 0,
  //step 3
  saleContractAddress: '',
  snapshot: 0,
  startAddWhiteTime: 0,
  endAddWhiteTime: 0,
  startExclusiveTime: 0,
  endExclusiveTime: 0,
  startDepositTime: 0,
  endDepositTime: 0,
  startClaimTime: 0,
  claimInterval: 0,
  claimPeriod: 0,
  claimFirst: 0,
  //step 4
  position: 'upcoming',
  production: 'dev',
  topSlideExposure: false,
};

export const AdminDetail: React.FC<AdminDetailProp> = (props) => {
  const {
    stepName,
    currentStep,
    setCurrentStep,
    library,
    existingData,
    setFinal,
  } = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const [stepCount, setStepCount] = useState<number>(1);

  const [data, setData] = useState<AdminObject>(
    existingData[0] !== undefined
      ? {...existingData[0], fundingTokenType: 'TON'}
      : initialValue,
  );

  const makeRequest = (formData: AdminObject) => {
    console.log('Form Submitted', formData);
    // return createStarter(formData);
  };

  const handleNextStep = (newData: any, final: boolean, check: boolean) => {
    setData((prev) => ({...prev, ...newData}));

    if (final) {
      makeRequest(newData);
      return;
    }
    console.log('--new data--');
    console.log(newData);

    setCurrentStep((prev) => {
      setStepCount(stepCount + 1);
      return prev + 1;
    });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  useEffect(() => {
    if (existingData[0] !== undefined) {
      console.log('existingData[0]');
      console.log(existingData[0]);
      setData({...existingData[0], fundingTokenType: 'TON'});
    }
  }, [existingData]);

  return (
    <Accordion
      w={'774px'}
      borderRadius={15}
      boxShadow={'0 2px 5px 0 rgba(61, 73, 93, 0.1)'}
      border={colorMode === 'light' ? '' : '1px solid #535353'}
      bg={colorMode === 'light' ? 'white.100' : ''}
      defaultIndex={0}
      index={currentStep}>
      {stepName.map((step: string, index: number) => {
        return (
          <AccordionItem
            border="none"
            pt={'13.5px'}
            pb={'13.5px'}
            isOpen={true}
            borderBottom={'1px solid #f4f6f8'}>
            <AccordionButton
              pr={'30px'}
              _hover={{}}
              onClick={() => stepCount > index && setCurrentStep(index)}>
              <Box
                flex="2"
                pl={'16px'}
                textAlign="left"
                fontSize={20}
                fontWeight={600}
                color={currentStep === index ? 'blue.100' : 'black.300'}>
                {step}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={0} pr={'35px'} pl={'35px'}>
              {currentStep === 0 && (
                <StepOne
                  data={data}
                  lastStep={index - 1 === stepName.length}
                  handleNextStep={handleNextStep}></StepOne>
              )}
              {currentStep === 1 && (
                <StepTwo
                  data={data}
                  lastStep={index - 1 === stepName.length}
                  handleNextStep={handleNextStep}
                  handlePrevStep={handlePrevStep}></StepTwo>
              )}
              {currentStep === 2 && (
                <StepThree
                  data={data}
                  lastStep={index - 1 === stepName.length}
                  handleNextStep={handleNextStep}
                  handlePrevStep={handlePrevStep}
                  library={library}></StepThree>
              )}
              {currentStep === 3 && (
                <StepFour
                  data={data}
                  lastStep={index - 1 === stepName.length}
                  handleNextStep={handleNextStep}
                  handlePrevStep={handlePrevStep}
                  library={library}
                  setFinal={setFinal}></StepFour>
              )}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
