import {useWeb3React} from '@web3-react/core';
import {useEffect, useState} from 'react';

export function useBlockNumber(): {blockNumber: number} {
  const [blockNumber, setBlockNumber] = useState<number>(0);
  const {library} = useWeb3React();

  useEffect(() => {
    if (library) {
      library.getBlockNumber().then((bn: any) => {
        setBlockNumber(bn);
      });
      library.on('block', setBlockNumber);
      return () => {
        library.removeListener('block', setBlockNumber);
        setBlockNumber(0);
      };
    }
  }, [library]);

  return {blockNumber};
}
