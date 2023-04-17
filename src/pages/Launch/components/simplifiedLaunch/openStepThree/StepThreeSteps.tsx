import {Flex, useColorMode, useTheme, Text, Image} from '@chakra-ui/react';
import {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';

import {useFormikContext} from 'formik';
import {Projects, VaultAny} from '@Launch/types';
import arrowLeft from 'assets/svgs/arrow_left_normal_icon.svg';
import arrowLeftDark from 'assets/launch/arrow-left-normal-icon.svg';
import arrowHoverLeft from 'assets/launch/arrow-left-hover-icon.svg';
import arrowRight from 'assets/svgs/arrow_right_normal_icon.svg';
import arrowRightDark from 'assets/launch/arrow-right-normal-icon.svg';
import arrowHoverRight from 'assets/launch/arrow-right-hover-icon.svg';
import arrowDisableLeftDark from 'assets/launch/light-arrow_left_disabled_dark.svg';
import arrowDisableRightDark from 'assets/launch/light-arrow_right_disabled_dark.svg';
import arrowDisableLeft from 'assets/launch/light-arrow_left_disabled.svg';
import arrowDisableRight from 'assets/launch/light-arrow_right_disabled.svg';
import HoverImage from 'components/HoverImage';
import {motion} from 'framer-motion';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {selectLaunch} from '@Launch/launch.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import ArrowImage from './ArrowImage';
type step = {
  vault: string;
  index: number;
  currentDeployStep: number;
  hoverVault: number;
  setHoverVault: Dispatch<SetStateAction<any>>;
  currentStep: number;
};
type ArrowImageProp = {
  img: string;
};
const StepThreeSteps = (props: {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<any>>;
}) => {
  const {currentStep, setCurrentStep} = props;
  const [maxStep, setStepMax] = useState(0);
  const {colorMode} = useColorMode();
  const [currentSlide, setCurrentSlide] = useState(0);

  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const vaults = [
    'Project Token',
    'Initial Liquidity',
    'Vesting',
    'Public Sale',
    'TON Staker',
    'TOS Staker',
    'WTON-TOS LP Reward',
    'TOKEN-TOS LP Reward',
    'Ecosystem',
    'Team',
    'Distribute Tokens',
    'Initial Liquidity',
    'Vesting',
    'Public Sale',
    'TON Staker',
    'TOS Staker',
    'WTON-TOS LP Reward',
    'TOKEN-TOS LP Reward',
    'Ecosystem',
    'Team',
  ];

  const theme = useTheme();

  const [hasToken, setHasToken] = useState(false);
  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);
  const [isHoverLeft, setIsHoverLeft] = useState(false);
  const [isHoverRight, setIsHoverRight] = useState(false);
  const [hoverVault, setHoverVault] = useState(-1);

  const {
    data: {currentDeployStep},
  } = useAppSelector(selectLaunch);

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
    const {vault, index, currentDeployStep,currentStep} = props;
      
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

    const handleMouseEnter = () => {
      setHoverVault(index);
    };

    const handleMouseLeave = () => {
      setHoverVault(-1);
    };

    const getHoverTitle = useMemo(() => {
      if (hoverVault === index) {
        return vault;
      } else if (hoverVault === -1 && currentDeployStep === index) {
        return vault;
      } else {
        return '';
      }
    }, [currentDeployTitle, vault]);

    return (
      <Flex
        flexDir={'column'}
        h="62px"
        // border="1px solid red"
        onMouseEnter={handleMouseEnter}
        justifyContent="center"
        onMouseLeave={handleMouseLeave}>
        <Text
          ml={vault.length < 8 ? '-3px' : '-20px'}
          zIndex={10000}
          fontWeight="bold"
          position="absolute"
          mt="-52px"
          w="100%"
          fontSize={12}>
          {getHoverTitle}
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
              : Number(currentDeployStep) === index
              ? 'blue.100'
              : 'transparent'
          }
          color={
            getStatus(index) === true
              ? '#0070ed'
              : Number(currentDeployStep) === index
              ? 'white.100'
              : '#86929d'
          }
          border={
            getStatus(index) === true
              ? colorMode === 'dark'
                ? '1px solid #353d48'
                : '1px solid #e6eaee'
              : Number(currentDeployStep) === index
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

  const settings = {
    accessibility: true,
    centerMode: true,
    centerPadding: '10px',
    speed: 500,
    variableWidth: true,
    initialSlide: Number(currentDeployStep),
    // arrows: true,
    swipeToSlide: true,
    // arrows: false,
    beforeChange: (next: any) => setCurrentSlide(next),
    afterChange: (current: any) => setCurrentSlide(current),
    focusOnSelect: true,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: (
      <Image
        h="20px"
        w="20px"
        className="slick-arrow"
        onMouseEnter={() => setIsHoverRight(true)}
        onMouseLeave={() => setIsHoverRight(false)}
        src={
          currentSlide >= 17
            ? colorMode === 'dark'
              ? arrowDisableRightDark
              : arrowDisableRight
            : isHoverRight
            ? arrowHoverRight
            : colorMode === 'dark'
            ? arrowRightDark
            : arrowRight
        }
      />
    ),
    prevArrow: (
      <Image
        className="slickArrowPrev"
        onMouseEnter={() => setIsHoverLeft(true)}
        onMouseLeave={() => setIsHoverLeft(false)}
        src={
          currentSlide === 0
            ? colorMode === 'dark'
              ? arrowDisableLeftDark
              : arrowDisableLeft
            : isHoverLeft
            ? arrowHoverLeft
            : colorMode === 'dark'
            ? arrowLeftDark
            : arrowLeft
        }
      />
    ),
  };

  const slickerStyles = `
  .slider-wrapper .slick-prev,
.slider-wrapper .slick-next {
  // display: none !important;
}
  .slick-slider{
    width: 325px;
    display: flex !important;
    align-items: center
  }
  .slick-slider .slick-track{
    // transform: translate3d(0px, 0px, 0px) !important;
  }
//  .slick-slide .slick-cloned{
//     margin-left:-50px !important
//   }
//   .slick-slide slick-active slick-center slick-current{
//     margin'right:40px !important
//   }
  `;

  // console.log(transX, flowIndex);
  const currentDeployTitles = vaults.filter(
    (vault: string, index: number) => index === currentDeployStep,
  );
  const currentDeployTitle = currentDeployTitles[0];

  return (
    <Flex w="350px" alignItems={'center'} mt="22px" className="slider-wrapper">
      <style>{slickerStyles}</style>
      <Flex w={'100%'} alignItems="center" mx={'15px'}>
        <Slider {...settings}>
          {vaults.map((vault: string, index: number) => {
            return (
              <Flex
                display={'flex !important'}
                alignItems={'center'}
                key={index}
                flexDir="row">
                {index !== 0 ? (
                  <Flex
                    w="18px"
                    h="2px"
                    bg={
                      index <= Number(currentDeployStep)
                        ? 'blue.100'
                        : colorMode === 'dark'
                        ? '#353d48'
                        : '#e6eaee'
                    }></Flex>
                ) : (
                  <></>
                )}
                <StepButton
                  vault={vault}
                  index={index}
                  hoverVault={hoverVault}
                  setHoverVault={setHoverVault}
                  currentDeployStep={currentDeployStep}
                  currentStep={currentStep}
                />

                {index !== vaults.length - 1 ? (
                  <Flex
                    w="18px"
                    h="2px"
                    bg={
                      Number(currentDeployStep) >= index
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
        </Slider>
      </Flex>
    </Flex>
  );
};

export default StepThreeSteps;
