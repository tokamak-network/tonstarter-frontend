import {Flex, useColorMode, useTheme, Text, Image} from '@chakra-ui/react';
import {useEffect, useState, useRef, Dispatch, SetStateAction} from 'react';

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
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
type step = {
  vault: string;
  index: number;
};
const StepThreeSteps = (props: {
  currentStep: Number;
  setCurrentStep: Dispatch<SetStateAction<any>>;
}) => {
  const {currentStep, setCurrentStep} = props;
  const [maxStep, setStepMax] = useState(0);
  const {colorMode} = useColorMode();
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const vaults = [
    'Project Token',
    'Initial Liquidity',
    'Vesting',
    'Public',
    'TON Staker',
    'TOS Staker',
    'WTON-TOS LP Reward',
    'TOKEN-TOS LP Reward',
    'Ecosystem',
    'Team',
    'Distribute Tokens',
    'Initial Liquidity',
    'Vesting',
    'Public',
    'TON Staker',
    'TOS Staker',
    'WTON-TOS LP Reward',
    'TOKEN-TOS LP Reward',
    'Ecosystem',
    'Team',
  ];

  const theme = useTheme();
  const [transX, setTransX] = useState<number>(0);
  const [flowIndex, setFlowIndex] = useState<number>(0);
  const [startIndex, setStartIndex] = useState<number>(vaults.length);
  const [hasToken, setHasToken] = useState(false);
  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);

  useEffect(() => {
    if (vaults.length < startIndex) {
      setTransX(transX + 60);
      setStartIndex(vaults.length);
      setFlowIndex(flowIndex - 1);
    } else {
      setStartIndex(vaults.length);
    }
  }, [vaults.length]);

  useEffect(() => {
    async function checkBalance() {
      if (ERC20_CONTRACT && values.vaults[0].vaultAddress) {
        const balance = await ERC20_CONTRACT.balanceOf(
          values.vaults[0].vaultAddress,
        );
        if (Number(balance) > 0) {
          setHasToken(true);
        } else {
          setHasToken(false);
        }
      }
    }
    checkBalance();
  }, [ERC20_CONTRACT, values]);

  const StepButton: React.FC<step> = (props) => {
    const {vault, index} = props;
    const [hover, setHover] = useState(false);

    const getStatus = (step: number) => {
      switch (step) {
        case 0: {
          if (values.isTokenDeployed === true) {
            return true;
          } else {
            return false;
          }
        }
        case 1: {
          if (values.vaults[1].vaultAddress !== undefined) {
            return true;
          } else {
            return false;
          }
        }
        case 2: {
          if (values.vaults[2].vaultAddress !== undefined) {
            return true;
          } else {
            return false;
          }
        }
        case 3: {
          if (values.vaults[0].vaultAddress !== undefined) {
            return true;
          } else {
            return false;
          }
        }
        case 4: {
          if (values.vaults[3].vaultAddress !== undefined) {
            return true;
          } else {
            return false;
          }
        }
        case 5: {
          if (values.vaults[4].vaultAddress !== undefined) {
            return true;
          } else {
            return false;
          }
        }
        case 6: {
          if (values.vaults[5].vaultAddress !== undefined) {
            return true;
          } else {
            return false;
          }
        }
        case 7: {
          if (values.vaults[6].vaultAddress !== undefined) {
            return true;
          } else {
            return false;
          }
        }
        case 8: {
          if (values.vaults[7].vaultAddress !== undefined) {
            return true;
          } else {
            return false;
          }
        }
        case 9: {
          if (values.vaults[8].vaultAddress !== undefined) {
            return true;
          } else {
            return false;
          }
        }
        case 10: {
          if (hasToken) {
            return true;
          } else {
            return false;
          }
        }
        case 11: {
          if (values.vaults[1].isSet === true) {
            return true;
          } else {
            return false;
          }
        }
        case 12: {
          if (values.vaults[2].isSet === true) {
            return true;
          } else {
            return false;
          }
        }
        case 13: {
          if (values.vaults[0].isSet === true) {
            return true;
          } else {
            return false;
          }
        }
        case 14: {
          if (values.vaults[3].isSet === true) {
            return true;
          } else {
            return false;
          }
        }
        case 15: {
          if (values.vaults[4].isSet === true) {
            return true;
          } else {
            return false;
          }
        }
        case 16: {
          if (values.vaults[5].isSet === true) {
            return true;
          } else {
            return false;
          }
        }
        case 17: {
          if (values.vaults[6].isSet === true) {
            return true;
          } else {
            return false;
          }
        }
        case 18: {
          if (values.vaults[7].isSet === true) {
            return true;
          } else {
            return false;
          }
        }
        case 19: {
          if (values.vaults[8].isSet === true) {
            return true;
          } else {
            return false;
          }
        }
      }
    };

    return (
      <Flex
        flexDir={'column'}
        h="62px"
        // border="1px solid red"
        onMouseEnter={() => setHover(true)}
        justifyContent="center"
        // alignItems={'center'}
        onMouseLeave={() => setHover(false)}>
        <Text
          ml={vault.length < 8 ? '-3px' : '-20px'}
          zIndex={10000}
          fontWeight="bold"
          position="absolute"
          mt="-52px"
          w="100%"
          fontSize={12}>
          {hover === true ? vault : ''}
        </Text>

        <Flex
          h="24px"
          w="24px"
          borderRadius={'50%'}
          justifyContent="center"
          alignItems={'center'}
          cursor={'pointer'}
          onClick={() => {
            setCurrentStep(index);
          }}
          bg={
            getStatus(index) === true
              ? 'transparent'
              : Number(currentStep) === index
              ? 'blue.100'
              : 'transparent'
          }
          color={
            getStatus(index) === true
              ? '#0070ed'
              : Number(currentStep) === index
              ? 'white.100'
              : '#86929d'
          }
          border={
            getStatus(index) === true
              ? colorMode === 'dark'
                ? '1px solid #353d48'
                : '1px solid #e6eaee'
              : Number(currentStep) === index
              ? 'none'
              : colorMode === 'dark'
              ? '1px solid #353d48'
              : '1px solid #e6eaee'
          }>
          <Text fontFamily={theme.fonts.titil} fontSize="13px">
            {index + 1}
          </Text>
        </Flex>
      </Flex>
    );
  };

  console.log('flowIndex',flowIndex);
  
  return (
    <Flex w="350px" alignItems={'center'} mt="41px">
      <HoverImage
        additionalStyles={{height: '26px', cursor: flowIndex !== 0?'default':"not-allowed"}}
        img={colorMode === 'light' ? arrowLeft : arrowLeftDark}
        hoverImg={flowIndex !== 0?arrowHoverLeft:colorMode === 'light' ? arrowLeft : arrowLeftDark }
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
          {vaults.map((vault: string, index: number) => {
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
                <StepButton vault={vault} index={index} />

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
        hoverImg={ flowIndex < vaults.length - 5? arrowHoverRight:colorMode === 'light' ? arrowRight : arrowRightDark }
        additionalStyles={{height: '26px', cursor: flowIndex < vaults.length - 5?'default':"not-allowed"}}
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
