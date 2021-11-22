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
      snapshot: Number(res[0].toString().replaceAll(',', '')),
      startAddWhiteTime: Number(res[1].toString().replaceAll(',', '')),
      endAddWhiteTime: Number(res[2].toString().replaceAll(',', '')),
      startExclusiveTime: Number(res[3].toString().replaceAll(',', '')),
      endExclusiveTime: Number(res[4].toString().replaceAll(',', '')),
      startDepositTime: Number(res[5].toString().replaceAll(',', '')),
      endDepositTime: Number(res[6].toString().replaceAll(',', '')),
      startClaimTime: Number(res[7].toString().replaceAll(',', '')),
      claimInterval: Number(res[8].toString().replaceAll(',', '')),
      claimPeriod: Number(res[9].toString().replaceAll(',', '')),
      claimFirst: Number(res[10].toString().replaceAll(',', '')),
    };
    return result;
  } catch (e) {
    console.log(e);
    if (e) {
      alert('Invalid Contract Address');
    }
  }
}
