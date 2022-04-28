import {Box, Button, Flex, useTheme, Text} from '@chakra-ui/react';
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
  const match = useRouteMatch();
  const {
    //@ts-ignore
    params: {id},
  } = match;
  const {url} = match;

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
        alignItems={'center'}>
        <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
          <PageHeader title={'Projects'} />
        </Flex>
        <Flex>
          <Button
            w={'170px'}
            h={'26px'}
            bg={'transparent'}
            border={'solid 1px #d7d9df'}
            borderRadius={'3px 0px 0px 3px'}
            fontSize={'12px'}
            fontFamily={theme.fonts.roboto}
            _hover={{background: 'transparent'}}
            _active={{
              background: 'transparent',
              border: 'solid 1px #2a72e5',
              color: '#2a72e5',
            }}
            onClick={() => {
              setShowAllProjects(true);
            }}
            isActive={showAllProjects}>
            All
          </Button>
          <Button
            w={'170px'}
            h={'26px'}
            bg={'transparent'}
            border={'solid 1px #d7d9df'}
            borderRadius={'0px 3px 3px 0px'}
            fontSize={'12px'}
            _hover={{
              background: 'transparent',
              border: 'solid 1px #2a72e5',
              color: '#2a72e5',
            }}
            _active={{
              background: 'transparent',
              border: 'solid 1px #2a72e5',
              color: '#2a72e5',
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
