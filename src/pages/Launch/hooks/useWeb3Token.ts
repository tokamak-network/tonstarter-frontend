import {useLocalStorage} from 'hooks/useStorage';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import getWeb3Token from 'utils/web3Token';

function useWeb3Token() {
  const [web3Token, setWeb3Token] = useState(undefined);
  const {account} = useActiveWeb3React();
  const [storageWeb3Token, setLocalStorageValue] = useLocalStorage(
    'web3Token',
    undefined,
  );

  useEffect(() => {
    async function fetchTokenData() {
      const token = await getWeb3Token();
      return setWeb3Token(token);
    }
    if (storageWeb3Token === undefined) fetchTokenData();
  }, [account, storageWeb3Token]);

  useEffect(() => {
    if (web3Token) setLocalStorageValue(web3Token);
  }, [web3Token, setLocalStorageValue]);

  return {storageWeb3Token};
}

export default useWeb3Token;
