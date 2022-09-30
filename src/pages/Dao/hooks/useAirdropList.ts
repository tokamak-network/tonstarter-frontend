import {useEffect, useState} from 'react';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import {DEPLOYED} from 'constants/index';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {convertNumber} from 'utils/number';
import {Contract} from '@ethersproject/contracts';
import * as LockTOSDividendABI from 'services/abis/LockTOSDividend.json';
import moment from 'moment';

type AirdropTokenList = {tokenName: string; amount: string}[];

const useAirdropList = () => {
  const [airdropList, setAirdropList] = useState<AirdropTokenList | undefined>(
    undefined,
  );
  const {LockTOSDividend_ADDRESS} = DEPLOYED;
  const {blockNumber} = useBlockNumber();
  const {library} = useActiveWeb3React();

  const LOCKTOS_DIVIDEND_CONTRACT = useContract(
    LockTOSDividend_ADDRESS,
    LockTOSDividendABI.abi,
  );

  useEffect(() => {
    async function fetchData() {
      let claimableTokens = [];
      let isError = false;
      let i = 0;

      try {
        do {
          try {
            const tokenAddress =
              await LOCKTOS_DIVIDEND_CONTRACT?.distributedTokens(i);
            claimableTokens.push(tokenAddress);
            if (tokenAddress === undefined) {
              break;
            }
            i++;
          } catch (e) {
            isError = true;
          }
        } while (isError === false);
      } catch (e) {
        console.log(e);
      }

      if (claimableTokens[0] === undefined) {
        return setAirdropList([]);
      }

      const tokens = claimableTokens;
      const nowTimeStamp = moment().unix();

      const result: {tokenName: string; amount: string}[] = await Promise.all(
        tokens.map(async (token: string) => {
          const tokenAmount = await LOCKTOS_DIVIDEND_CONTRACT?.tokensPerWeekAt(
            token,
            nowTimeStamp,
          );

          const ERC20_CONTRACT = new Contract(token, ERC20.abi, library);
          const tokenSymbol = await ERC20_CONTRACT.symbol();
          const tokenDecimals = await ERC20_CONTRACT.decimals();

          return {
            tokenName: tokenSymbol,
            amount: convertNumber({
              amount: tokenAmount.toString(),
              localeString: true,
              type: 'custom',
              decimalPoints: tokenDecimals,
            }) as string,
          };
        }),
      );

      return setAirdropList(
        result.filter((data) => {
          return Number(data.amount.replaceAll(',', '')) > 0;
        }),
      );
    }
    fetchData();
  }, [blockNumber, LOCKTOS_DIVIDEND_CONTRACT, library]);

  return {airdropList};
};

export default useAirdropList;
