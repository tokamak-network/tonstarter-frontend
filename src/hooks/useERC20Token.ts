import {useEffect, useState} from 'react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {convertNumber} from 'utils/number';

export const useERC20Token = (props: {
  tokenAddress: string;
  isRay?: boolean;
}): {tokenBalance: string; tokenSymbol: string} => {
  const {tokenAddress, isRay} = props;
  const {account, library} = useActiveWeb3React();
  const {blockNumber} = useBlockNumber();

  const [tokenBalance, setTokenBalance] = useState<string>('0.00');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const TOKEN_CONTRACT = useContract(tokenAddress, ERC20.abi);

  useEffect(() => {
    async function fetchData() {
      if (account && TOKEN_CONTRACT) {
        const balance = await TOKEN_CONTRACT.balanceOf(account);
        const symbol = await TOKEN_CONTRACT.symbol();
        const convertedBalance = convertNumber({
          amount: balance.toString(),
          localeString: true,
          round: false,
          type: isRay ? 'ray' : 'wei',
        }) as string;

        setTokenBalance(convertedBalance);
        setTokenSymbol(symbol);
      }
    }
    if (account && TOKEN_CONTRACT) {
      fetchData();
    }
  }, [account, library, blockNumber, TOKEN_CONTRACT, isRay]);

  return {tokenBalance, tokenSymbol};
};
