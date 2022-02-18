import {Flex, useTheme, Button} from '@chakra-ui/react';
import {useQuery} from 'react-query';
import axios from 'axios';
import {fetchCampaginURL} from 'constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect} from 'react';
import MainScreen from '@OpenCampagin/MainScreen';

const OpenCampagin = () => {
  const {account} = useActiveWeb3React();

  const {data, isLoading, error} = useQuery(
    ['test'],
    () => axios.get(fetchCampaginURL),
    {
      enabled: !!account,
    },
  );

  useEffect(() => {
    console.log('--data--');
    console.log(data);
  }, [data]);

  return (
    <Flex flexDir="column">
      <Flex justifyContent={'center'} mb={50}>
        <Button bg={'red.100'} color={'white.100'} mt={'148px'} _hover={{}}>
          Save(server)
        </Button>
      </Flex>
      <Flex Flex justifyContent={'center'}>
        <MainScreen></MainScreen>
      </Flex>
      <Flex></Flex>
      <Flex></Flex>
    </Flex>
  );
};

export default OpenCampagin;
