import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {DEPLOYED} from 'constants/index';
import * as Stake1Vault from 'services/abis/Stake1Vault.json';

export const checkSaleClosed = async (vaultAddress: string, library: any) => {
  const stakeVault = new Contract(vaultAddress, Stake1Vault.abi, library);

  console.log(vaultAddress);
  console.log(library);
  console.log(await stakeVault);
  console.log(await stakeVault.saleClosed());
};
