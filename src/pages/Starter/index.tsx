import {Flex} from '@chakra-ui/react';
import {StarterMain} from './StartetMain';
import {fetchStarters} from './starter.reducer';
import {useAppDispatch} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect} from 'react';

export const Starter = () => {
  const dispatch = useAppDispatch();
  const {chainId, library} = useActiveWeb3React();

  useEffect(() => {
    async function fetchData() {
      await dispatch(
        fetchStarters({
          chainId,
          library,
        }) as any,
      );
    }
    fetchData();
  }, [chainId, dispatch, library]);

  return (
    <Flex mt={'72px'}>
      <StarterMain></StarterMain>
    </Flex>
  );
};
