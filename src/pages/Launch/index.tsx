import {Flex, useTheme, Button} from '@chakra-ui/react';
import {useQuery} from 'react-query';
import axios from 'axios';
import {fetchCampaginURL} from 'constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect} from 'react';
import MainScreen from '@Launch/MainScreen';
import useWeb3Token from '@Launch/hooks/useWeb3Token';

const OpenCampagin = () => {
  const {account} = useActiveWeb3React();
  const {web3Token} = useWeb3Token();

  console.log(web3Token);

  // const {data, isLoading, error} = useQuery(
  //   ['test'],
  //   () => axios.get(fetchCampaginURL),
  //   {
  //     enabled: !!account,
  //   },
  // );

  // useEffect(() => {
  //   console.log('--data--');
  //   console.log(data);
  // }, [data]);

  return (
    <Flex flexDir="column" mt={100}>
      <Flex Flex justifyContent={'center'}>
        <MainScreen></MainScreen>
      </Flex>
      <Flex></Flex>
      <Flex></Flex>
    </Flex>
  );
};

export default OpenCampagin;
