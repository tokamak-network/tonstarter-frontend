import {Flex, useColorMode, useTheme, Text, Image} from '@chakra-ui/react';
import {useEffect, useState, Dispatch, SetStateAction} from 'react';

import {useFormikContext} from 'formik';
import {Projects, VaultAny} from '@Launch/types';
import arrowLeft from 'assets/svgs/arrow_left_normal_icon.svg';
import arrowLeftDark from 'assets/launch/arrow-left-normal-icon.svg';
import arrowHoverLeft from 'assets/launch/arrow-left-hover-icon.svg';
import arrowRight from 'assets/svgs/arrow_right_normal_icon.svg';
import arrowRightDark from 'assets/launch/arrow-right-normal-icon.svg';
import arrowHoverRight from 'assets/launch/arrow-right-hover-icon.svg';
import HoverImage from 'components/HoverImage';
import {motion} from 'framer-motion';

const StepThreeSteps = (props: {
  currentStep: Number;
  setCurrentStep: Dispatch<SetStateAction<any>>;
}) => {
  const {currentStep,setCurrentStep} = props;
  const [maxStep, setStepMax] = useState(0);
  const {colorMode} = useColorMode();
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const vaults = Array.from(Array(11).keys())

  const theme = useTheme();
  const [transX, setTransX] = useState<number>(0);
  const [flowIndex, setFlowIndex] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(vaults.length);

  useEffect(() => {
    if (vaults.length < startIndex) {
      setTransX(transX + 60);
      setStartIndex(vaults.length);
      setFlowIndex(flowIndex - 1);
    } else {
      setStartIndex(vaults.length);
    }
  }, [vaults.length]);

  return (
    <Flex w="350px" alignItems={'center'} mt="16px">
      <HoverImage
        additionalStyles={{height: '26px'}}
        img={colorMode === 'light' ? arrowLeft : arrowLeftDark}
        hoverImg={arrowHoverLeft}
        action={() => {
          if (flowIndex !== 0) {
            setTransX(transX + 60);
            setFlowIndex(flowIndex - 1);
          }
        }}></HoverImage>

      <Flex w={'100%'} alignItems="center" mx={'15px'} overflow={'hidden'}>
        <motion.div
          animate={{x: transX}}
          style={{display: 'flex', width: '100%'}}>
          {vaults.map(( index: number) => {
            return (
              <Flex alignItems={'center'} key={index}>
                {index !== 0 ? (
                  <Flex
                    w="18px"
                    h="2px"
                    bg={
                      Number(currentStep) === index
                        ? 'blue.100'
                        : colorMode === 'dark'
                        ? '#353d48'
                        : '#e6eaee'
                    }></Flex>
                ) : (
                  <></>
                )}
                <Flex
                  h="24px"
                  w="24px"
                  borderRadius={'50%'}
                  justifyContent="center"
                  alignItems={'center'}
                  cursor={'pointer'}
                  onClick={()=>setCurrentStep(index)}
                  bg={
                    Number(currentStep) === index ? 'blue.100' : 'transparent'
                  }
                  color={
                    Number(currentStep) === index ? 'white.100' : 'blue.100'
                  }
                  border={
                    Number(currentStep) === index
                      ? 'none'
                      : colorMode === 'dark'
                      ? '1px solid #353d48'
                      : '1px solid #e6eaee'
                  }>
                  <Text fontFamily={theme.fonts.titil} fontSize="14px">
                    {index + 1}
                  </Text>
                </Flex>
                {index !== vaults.length - 1 ? (
                  <Flex
                    w="18px"
                    h="2px"
                    bg={
                      Number(currentStep) === index
                        ? 'blue.100'
                        : colorMode === 'dark'
                        ? '#353d48'
                        : '#e6eaee'
                    }></Flex>
                ) : (
                  <></>
                )}
              </Flex>
            );
          })}
        </motion.div>
      </Flex>
      <HoverImage
        img={colorMode === 'light' ? arrowRight : arrowRightDark}
        hoverImg={arrowHoverRight}
        additionalStyles={{height: '26px'}}
        action={() => {
          if (flowIndex < vaults.length - 5) {
            setTransX(transX - 60);
            setFlowIndex(flowIndex + 1);
          }
        }}></HoverImage>
     
    </Flex>
  );
};

export default StepThreeSteps;
