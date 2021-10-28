import * as publicSale from 'services/abis/PublicSale.json';
import {Contract} from '@ethersproject/contracts';
import {LibraryType} from 'types';

interface I_CallContract {
  library: LibraryType;
  address: string;
}

export async function getTotalExpectSaleAmount(args: I_CallContract) {
  try {
    const {library, address} = args;
    const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
    const res = await Promise.all([
      PUBLICSALE_CONTRACT.snapshot(),
      PUBLICSALE_CONTRACT.startAddWhiteTime(),
      PUBLICSALE_CONTRACT.endAddWhiteTime(),
      PUBLICSALE_CONTRACT.startExclusiveTime(),
      PUBLICSALE_CONTRACT.endExclusiveTime(),
      PUBLICSALE_CONTRACT.startDepositTime(),
      PUBLICSALE_CONTRACT.endDepositTime(),
      PUBLICSALE_CONTRACT.startClaimTime(),
      PUBLICSALE_CONTRACT.claimInterval(),
      PUBLICSALE_CONTRACT.claimPeriod(),
      PUBLICSALE_CONTRACT.claimFirst(),
    ]);
    const result = {
      snapshot: res[0].toString(),
      startAddWhiteTime: res[1].toString(),
      endAddWhiteTime: res[2].toString(),
      startExclusiveTime: res[3].toString(),
      endExclusiveTime: res[4].toString(),
      startDepositTime: res[5].toString(),
      endDepositTime: res[6].toString(),
      startClaimTime: res[7].toString(),
      claimInterval: res[8].toString(),
      claimPeriod: res[9].toString(),
      claimFirst: res[10].toString(),
    };
    return result;
  } catch (e) {
    if (e) {
      alert('Invalid Contract Address');
    }
  }
}
