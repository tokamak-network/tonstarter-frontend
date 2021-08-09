import {Contract} from '@ethersproject/contracts';
import * as Stake1Vault from 'services/abis/Stake1Vault.json';

export const checkSaleClosed = async (vaultAddress: string, library: any) => {
  const stakeVault = new Contract(vaultAddress, Stake1Vault.abi, library);
  return await stakeVault.saleClosed();
};
