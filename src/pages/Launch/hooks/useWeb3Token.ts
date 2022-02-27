import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import getWeb3Token from 'utils/web3Token';

function useWeb3Token() {
  const [web3Token, setWeb3Token] = useState(undefined);
  const {account} = useActiveWeb3React();

  useEffect(() => {
    async function fetchTokenData() {
      const token = await getWeb3Token();
      return setWeb3Token(token);
    }
    fetchTokenData();
  }, [account]);

  return {web3Token};
}

export default useWeb3Token;
