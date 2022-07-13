import {
  Box,
  Button,
  Flex,
  useTheme,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import {useState, useEffect} from 'react';
import {PageHeader} from 'components/PageHeader';
import {useRouteMatch} from 'react-router-dom';
import AllProjects from './Components/MobileAllProjects';
import {motion, AnimatePresence} from 'framer-motion';
import {wrap} from 'popmotion';
import MobileLaunchPageBackground from 'assets/banner/MobileLaunchPageBackground.png';
import {useModal} from 'hooks/useModal';
//   import ConfirmTermsModal from './components/modals/ConfirmTerms';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {injected} from 'connectors';

type LaunchProps = {
  numPairs: Number;
};

const MobileLaunchPage: React.FC<LaunchProps> = ({numPairs}) => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const match = useRouteMatch();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0)

  const infoList = [
    {name: 'Raised Capital', info: '$ 7,115,401.98'},
    {name: 'TOS Pairs (in Uniswap)', info: '23'},
  ];
  const infoIndex = wrap(0, infoList.length, page);
  const {
    //@ts-ignore
    params: {id},
  } = match;
  const {url} = match;
  const {active, activate, connector} = useActiveWeb3React();
  useEffect(() => {
    setInterval(() => {

      if (page === 1) {        
        paginate(-1);
      } else {        
        paginate(1);
      }
    }, 2000);
    /*eslint-disable*/
  }, []);

  const paginate = (newDirection: number) => {
    setPage(x => x + newDirection);
    setDirection(newDirection)
  };

  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: 'gray.250',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  const variants = {
    enter: (direction: number) => {
      return {
        y: direction > 0 ? -45 : +45,
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    // exit: (direction: number) => {
    //   return {
    //     zIndex: 0,
    //     y: direction < 0 ? 45 : -45,
    //     opacity: 0
    //   };
    // }
  };

  const {openAnyModal} = useModal();

  return (
    <Flex flexDir={'column'} justifyContent={'center'} w={'100%'}>
      <Flex
        h={'340px'}
        // pos="relative"
        w={'100%'}
        alignItems="center"
        justifyContent="center">
        <img
          height={'375px'}
          width={'100%'}
          alt={'banner-img'}
          src={MobileLaunchPageBackground}
          style={{height: '340px', width: '100%'}}
        />
        <Flex
          position={'absolute'}
          justifyContent={'space-between'}
          flexDirection={'column'}
          height={'340px'}
          left={'50%'}
          w={'100%'}
          transform={'translateX(-50%)'}>
          <Flex></Flex>
          <Flex alignItems={'center'} flexDir="column">
            <Text
              color={'#fff'}
              fontSize={'35px'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.poppins}>
              Launch
            </Text>
            <Text
              color={'#fff'}
              fontFamily={theme.fonts.roboto}
              fontSize={'14px'}
              textAlign={'center'}
              opacity={0.8}>
              Make Your Own Token and Create a Token Economy.
            </Text>
          </Flex>
          <Flex
            flexDir={'column'}
            // justifyContent={'center'}
            // alignItems={'center'}
            background={'rgba(7, 7, 10, .8)'}
            width="100%"
            // position={'absolute'}
          >
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                style={{height: '45px', overflow: 'hidden'}}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                key={page}
                transition={{
                  y: {type: 'spring', stiffness: 300, damping: 30}
                }}>
                <Flex
                  justifyContent={'space-between'}
                  flexDir="row"
                  alignItems={'center'}
                  h={'45px'}
                  px={'20px'}
                  w={'100%'}
                  fontFamily={theme.fonts.fld}>
                  <Text color={'yellow'} fontSize={'14px'}>
                    {infoList[infoIndex].name}
                  </Text>
                  <Text color={'#fff'} fontSize={'15px'}>
                    {infoList[infoIndex].info}
                  </Text>
                </Flex>

                {/* <Flex
                  justifyContent={'space-between'}
                  flexDir="row"
                  alignItems={'center'}
                  h={'45px'}
                  px={'20px'}
                  w={'100%'}
                  fontFamily={theme.fonts.fld}>
                  <Text color={'yellow'} fontSize={'14px'}>
                    Raised Capital
                  </Text>
                  <Text color={'#fff'} fontSize={'15px'}>
                    $2,646,790.91
                  </Text>
                </Flex> */}
                {/* <Flex
                  justifyContent={'space-between'}
                  flexDir="row"
                  alignItems={'center'}
                  h={'45px'}
                  px={'20px'}
                  w={'100%'}
                  fontFamily={theme.fonts.fld}>
                  <Text color={'yellow'} fontSize={'14px'}>
                    Raised Capital
                  </Text>
                  <Text color={'#fff'} fontSize={'15px'}>
                    $2,646,790.91
                  </Text>
                </Flex> */}
              </motion.div>
            </AnimatePresence>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        mt={'30px'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}>
        <AllProjects />
      </Flex>
    </Flex>
  );
};
export default MobileLaunchPage;
