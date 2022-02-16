import {useEffect, useState} from 'react';
import {useBlockNumber} from 'hooks/useBlock';
import {ClaimList} from '@Dao/types';
import {useContract} from 'hooks/useContract';
import {DEPLOYED} from 'constants/index';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as LockTOSDividend from 'services/abis/LockTOSDividend.json';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {convertNumber} from 'utils/number';
import {Contract} from '@ethersproject/contracts';
import {getTokenPrice} from 'utils/tokenPrice';

const useDividendPool = () => {
  const [claimList, setClaimList] = useState<ClaimList[] | []>([]);
  const {blockNumber} = useBlockNumber();
  const {account, library} = useActiveWeb3React();
  const {LockTOSDividend_ADDRESS, TON_ADDRESS} = DEPLOYED;

  const LOCKTOS_DIVIDEND_CONTRACT = useContract(
    LockTOSDividend_ADDRESS,
    LockTOSDividend.abi,
  );

  useEffect(() => {
    async function fetchData() {
      let claimableTokens = [];
      let isError = false;
      let i = 0;

      do {
        try {
          const tokenAddress =
            await LOCKTOS_DIVIDEND_CONTRACT?.distributedTokens(i);
          claimableTokens.push(tokenAddress);
          i++;
        } catch (e) {
          isError = true;
        }
      } while (isError === false);

      const tokens = claimableTokens;

      //project tokens
      const res: ClaimList[] = await Promise.all(
        tokens.map(async (tokenAddress: string, index: number) => {
          //https://api.coingecko.com/api/v3/coins/list
          // const tokenName =
          //   tokenAddress === TON_ADDRESS
          //     ? 'TON'
          //     : tokenAddress === TOS_ADDRESS
          //     ? 'TOS'
          //     : '';
          const ERC20_CONTRACT = new Contract(tokenAddress, ERC20.abi, library);

          const tokenSymbol = await ERC20_CONTRACT.symbol();
          const tokenContractName = await ERC20_CONTRACT.name();
          const tokenName =
            tokenAddress === TON_ADDRESS
              ? 'tokamak-network'
              : tokenContractName.toLowerCase().replaceAll(' ', '');
          const amount = await LOCKTOS_DIVIDEND_CONTRACT?.claimable(
            account,
            tokenAddress,
          );

          const claimAmount =
            convertNumber({
              amount: amount.toString(),
              localeString: true,
              type: tokenSymbol !== 'WTON' ? 'wei' : 'ray',
            }) || '0.00';
          const price = await getTokenPrice(tokenName);
          const obj = {
            name: `#${index + 1}`,
            tokenName: tokenSymbol,
            claimAmount,
            price: price * Number(claimAmount.replaceAll(',', '')),
            tokenAddress,
          };
          return obj;
        }),
      );
      return setClaimList(res);
    }

    if (LOCKTOS_DIVIDEND_CONTRACT) {
      fetchData();
    }
  }, [blockNumber, LOCKTOS_DIVIDEND_CONTRACT, account, library, TON_ADDRESS]);
  return {claimList};
};

export default useDividendPool;
