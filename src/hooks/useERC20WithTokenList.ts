import {useEffect, useState} from 'react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useBlockNumber} from 'hooks/useBlock';
// import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
// import {convertNumber} from 'utils/number';
import {getContract} from 'utils/contract';

export const useERC20WithTokenList = (tokenList: any) => {
  const {account, library} = useActiveWeb3React();
  const {blockNumber} = useBlockNumber();

  const [resultsArray, setResultsArray] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUseERC20TokenData() {
      if (library && account && tokenList) {
        let resultsArr = await Promise.all(
          tokenList.map(async (token: any) => {
            let tokenInfo = getContract(
              token.rewardToken,
              ERC20.abi,
              library,
              account,
            );
            let symbol = await tokenInfo.symbol();
            let tokenCopy = {...token, symbol};
            return tokenCopy;
          }),
        );
        setResultsArray(resultsArr);
      }
    }
    if (account && tokenList && library) {
      fetchUseERC20TokenData();
    }
  }, [account, library, blockNumber, tokenList]);
  return resultsArray;
};
