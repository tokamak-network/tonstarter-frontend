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

interface I_CallContract {
  account: string;
  library: LibraryType;
}

export const getClaimalbeList = async (
  args: I_CallContract & {starterData: AdminObject[]},
): Promise<ClaimList[] | undefined> => {
  try {
    const {account, library, starterData} = args;

    const {LockTOSDividend_ADDRESS, TON_ADDRESS, TOS_ADDRESS} = DEPLOYED;
    const LOCKTOS_DIVIDEND_CONTRACT = new Contract(
      LockTOSDividend_ADDRESS,
      LockTOSDividend.abi,
      library,
    );

    // const availableClaimList =
    //   await LOCKTOS_DIVIDEND_CONTRACT.getAvailableClaims(account);

    //project tokens
    const res: ClaimList[] = await Promise.all(
      starterData.map(async (data: AdminObject) => {
        const {tokenAddress, name, tokenName} = data;
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
          name,
          tokenName,
          claimAmount,
          price: price * Number(claimAmount.replaceAll(',', '')),
          tokenAddress,
        };
        return obj;
      }),
    );

    //TON,TOS
    const claimAmount_TON = await LOCKTOS_DIVIDEND_CONTRACT.claimable(
      account,
      TON_ADDRESS,
    );
    const convertedClimAmount_TON =
      convertNumber({
        amount: claimAmount_TON.toString(),
        localeString: true,
      }) || '0.00';
    const PRICE_TON = await getTokenPrice('tokamak-network');
    const claimAmount_TOS = await LOCKTOS_DIVIDEND_CONTRACT.claimable(
      account,
      TOS_ADDRESS,
    );
    const convertedClimAmount_TOS =
      convertNumber({
        amount: claimAmount_TOS.toString(),
        localeString: true,
      }) || '0.00';
    const PRICE_TOS = await getTokenPrice('tonstarter');

    res.push(
      {
        name: 'TON',
        tokenName: 'TON',
        claimAmount: convertedClimAmount_TON,
        price: PRICE_TON * Number(convertedClimAmount_TON.replaceAll(',', '')),
        tokenAddress: TON_ADDRESS,
      },
      {
        name: 'TOS',
        tokenName: 'TOS',
        claimAmount: convertedClimAmount_TOS,
        price: PRICE_TOS * Number(convertedClimAmount_TOS.replaceAll(',', '')),
        tokenAddress: TOS_ADDRESS,
      },
    );

    return res;
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
