import {Contract} from '@ethersproject/contracts';
import * as Stake1Vault from 'services/abis/Stake1Vault.json';
import {LibraryType} from 'types';
import * as StakeTON from 'services/abis/StakeTON.json';

export const checkSaleClosed = async (vaultAddress: string, library: any) => {
  const stakeVault = new Contract(vaultAddress, Stake1Vault.abi, library);
  return await stakeVault.saleClosed();
};

export const checkIsUnstake = async (
  contractAddress: string,
  account: string,
  library: LibraryType,
): Promise<boolean> => {
  const StakeTONContract = new Contract(contractAddress, StakeTON.abi, library);
  const res = await StakeTONContract.userStaked(account);
  return res.released;
};
