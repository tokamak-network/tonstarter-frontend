import * as LockTOSDividend from 'services/abis/LockTOSDividend.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';
import {convertNumber} from 'utils/number';
import store from 'store';
import {openToast} from 'store/app/toast.reducer';
import {DEPLOYED} from 'constants/index';
import {AdminObject} from '@Admin/types';
import {ClaimList} from '@Dao/types';
import {getTokenPrice} from 'utils/tokenPrice';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';

interface I_CallContract {
  account: string;
  library: LibraryType;
}

export const getClaimalbeList = async (
  args: I_CallContract,
): Promise<ClaimList[] | undefined> => {
  try {
    const {account, library} = args;

    const {LockTOSDividend_ADDRESS, TON_ADDRESS, TOS_ADDRESS} = DEPLOYED;
    const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
      LockTOSDividend_ADDRESS,
      LockTOSDividend.abi,
      library,
    );

    const availableClaimList =
      await LOCKTOS_DIVIDEND_CONTRACT.getAvailableClaims(account);

    const tokens = availableClaimList[0];

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
        const amount = await LOCKTOS_DIVIDEND_CONTRACT.claimable(
          account,
          tokenAddress,
        );

        const claimAmount =
          convertNumber({
            amount: amount.toString(),
            localeString: true,
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
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const claimDividendPool = async (
  args: I_CallContract & {tokenAddress: string[]},
) => {
  try {
    const {account, library, tokenAddress} = args;

    const {LockTOSDividend_ADDRESS} = DEPLOYED;
    const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
      LockTOSDividend_ADDRESS,
      LockTOSDividend.abi,
      library,
    );

    const signer = getSigner(library, account);
    const res = await LOCKTOS_DIVIDEND_CONTRACT.connect(signer).claimBatch(
      tokenAddress,
    );

    return setTx(res);
  } catch (e) {
    console.log(e);
    store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          status: 'error',
          title: 'Tx fail to send',
          description: `something went wrong`,
          duration: 5000,
          isClosable: true,
        },
      }),
    );
  }
};
