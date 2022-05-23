import {useEffect, useState} from 'react';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {convertNumber} from 'utils/number';

export const useERC20Token = (props: {
  tokenAddress: string;
}): {tokenBalance: string; tokenSymbol: string; tokenDecimals: number} => {
  const {tokenAddress} = props;
  const {account, library} = useActiveWeb3React();
  const {blockNumber} = useBlockNumber();

  const [tokenBalance, setTokenBalance] = useState<string>('0.00');
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [tokenDecimals, setTokenDecimals] = useState<number>(0);
  const TOKEN_CONTRACT = useContract(tokenAddress, ERC20.abi);

  useEffect(() => {
    async function fetchUseERC20TokenData() {
      if (account && TOKEN_CONTRACT) {
        const balance = await TOKEN_CONTRACT.balanceOf(account);
        const symbol = await TOKEN_CONTRACT.symbol();
        const decimals = await TOKEN_CONTRACT.decimals();
        const convertedBalance = convertNumber({
          amount: balance.toString(),
          localeString: true,
          round: false,
          type: 'custom',
          decimalPoints: decimals,
        }) as string;

        setTokenBalance(convertedBalance);
        setTokenSymbol(symbol);
        setTokenDecimals(decimals);
      }
    }
    if (account && TOKEN_CONTRACT) {
      fetchUseERC20TokenData();
    }
  }, [account, library, blockNumber, TOKEN_CONTRACT]);

  return {tokenBalance, tokenSymbol, tokenDecimals};
};