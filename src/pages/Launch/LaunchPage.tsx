import {
  Box,
  Button,
  Flex,
  useTheme,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import {useState} from 'react';
import {PageHeader} from 'components/PageHeader';
import {Link, useRouteMatch} from 'react-router-dom';
import AllProjects from '@Launch/components/AllProjects';
import MyProjects from '@Launch/components/MyProjects';
import LaunchPageBackground from '../../assets/banner/LaunchPageBackground.png';
import {useModal} from 'hooks/useModal';
import ConfirmTermsModal from './components/modals/ConfirmTerms';

const LaunchPage = () => {
  const [showAllProjects, setShowAllProjects] = useState<boolean>(true);
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const match = useRouteMatch();
  const {
    //@ts-ignore
    params: {id},
  } = match;
  const {url} = match;

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

  const {openAnyModal} = useModal();

  return (
    <Flex
      flexDir={'column'}
      justifyContent={'center'}
      w={'100%'}
      mb={'100px'}
      overflowX={'hidden'}>
      <Flex
        pos="relative"
        w={'100%'}
        // bgImage={bannerImg1X}
        // backgroundRepeat="no-repeat"
        // backgroundPosition="center"
        style={{height: '510px'}}
        alignItems="center"
        justifyContent="center">
        <img
          alt={'banner-img'}
          src={LaunchPageBackground}
          style={{height: '510px'}}
        />
        <Flex
          position={'absolute'}
          alignItems={'space-between'}
          flexDirection={'column'}
          height={'200px'}
          left={'50%'}
          transform={'translateX(-50%)'}>
          <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
            <PageHeader
              title={'Launch'}
              subtitle={'Make your own token and create a token economy.'}
            />
          </Flex>
          <Flex justifyContent={'center'} w={'100%'}>
            {/* <Link to={`${url}/createproject`}> */}
            <Button
              bg={'blue.100'}
              color="white.100"
              onClick={() => {
                openAnyModal('Launch_ConfirmTerms', {});
              }}>
              Create Project
            </Button>
            {/* </Link> */}
          </Flex>
        </Flex>

        <Flex
          justifyContent={'space-between'}
          paddingX={'20%'}
          mb={'100px'}
          position={'absolute'}
          bottom={'-20%'}
          background={'rgba(7, 7, 10, .7)'}
          paddingY={'10px'}
          left={'50%'}
          transform={'translateX(-50%)'}>
          <Flex alignItems={'center'} flexDir="column" width={'300px'}>
            <Text color={'yellow'}>Total Staked</Text>
            <Text>2,646,790.91 TON</Text>
          </Flex>
          <Flex alignItems={'center'} flexDir="column" width={'300px'}>
            <Text color={'yellow'}>Total Value Locked</Text>
            <Text>2,646,790.91 TON</Text>
          </Flex>
          <Flex alignItems={'center'} flexDir="column" width={'300px'}>
            <Text color={'yellow'}>Total Staked</Text>
            <Text>2,646,790.91 TON</Text>
          </Flex>
        </Flex>
      </Flex>

      <Box
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        mb={'50px'}>
        <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
          <PageHeader title={'Projects'} />
        </Flex>
        <Flex>
          <Button
            w={'160px'}
            h={'38px'}
            bg={'transparent'}
            border={themeDesign.border[colorMode]}
            borderRadius={'3px 0px 0px 3px'}
            fontSize={'14px'}
            fontFamily={theme.fonts.fld}
            _hover={{
              background: 'transparent',
              border: 'solid 1px #2a72e5',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            _active={{
              background: '#2a72e5',
              border: 'solid 1px #2a72e5',
              color: '#ffffff',
            }}
            onClick={() => {
              setShowAllProjects(true);
            }}
            isActive={showAllProjects}>
            All
          </Button>
          <Button
            w={'160px'}
            h={'38px'}
            bg={'transparent'}
            border={themeDesign.border[colorMode]}
            borderRadius={'0px 3px 3px 0px'}
            fontSize={'14px'}
            fontFamily={theme.fonts.fld}
            _hover={{
              background: 'transparent',
              border: 'solid 1px #2a72e5',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            _active={{
              background: '#2a72e5',
              border: 'solid 1px #2a72e5',
              color: '#ffffff',
            }}
            onClick={() => {
              setShowAllProjects(false);
            }}
            isActive={!showAllProjects}>
            My
          </Button>
        </Flex>
      </Box>
      {showAllProjects ? <AllProjects /> : <MyProjects />}
      <ConfirmTermsModal></ConfirmTermsModal>
    </Flex>
  );
};

export default LaunchPage;
