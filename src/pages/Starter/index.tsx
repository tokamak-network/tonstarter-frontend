import {Flex, Center} from '@chakra-ui/react';
// import {StarterMain} from './StartetMain';
import {fetchStarters} from './starter.reducer';
import {useAppDispatch} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {StarterDetail} from './StarterDetail';
import {LoadingComponent} from 'components/Loading';
import {useBlockNumber} from 'hooks/useBlock';
// import {fetchUserInfo} from 'store/app/user.reducer';
// import store from 'store';

export const Starter = () => {
  const dispatch = useAppDispatch();
  const {chainId, library, account} = useActiveWeb3React();
  const {blockNumber} = useBlockNumber();

  const [loading, setLoading] = useState(true);

  // const userData = store.getState().user.data;

  useEffect(() => {
    async function fetchData() {
      await dispatch(
        fetchStarters({
          chainId,
          library,
        }) as any,
      ).then((data: any) => {
        if (data.payload) {
          setLoading(false);
        }
      });
    }
    if (library && account) {
      fetchData();
    }
  }, [chainId, account, dispatch, library, blockNumber]);

  return (
    <Flex mt={'72px'} w={'100%'} alignItems="center">
      {loading === false ? (
        <StarterDetail></StarterDetail>
      ) : (
        <Center w={'100%'} mt={'70px'}>
          <LoadingComponent />
        </Center>
      )}
    </Flex>
  );
};
