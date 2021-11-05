import {DEPLOYED} from 'constants/index';
import * as LockTOSDividendABI from 'services/abis/LockTOSDividend.json';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import {setTx} from 'application';
import {LibraryType} from 'types';
import {getTokenPrice} from 'utils/tokenPrice';

interface Airdrop {
  account: string;
  library: LibraryType;
  tokenAddresses: string[];
}

export const getAirdropList = async (args: Airdrop) => {
  const {account, library, tokenAddresses} = args;
  const {LockTOSDividend_ADDRESS} = DEPLOYED;
  const LockTOSDividend_CONTRACT = new Contract(
    LockTOSDividend_ADDRESS,
    LockTOSDividendABI.abi,
    library,
  );

  console.log(args);

  const res = await Promise.all(
    tokenAddresses.map(async (address: string) => {
      console.log(account, address);
      const isClaimable = await LockTOSDividend_CONTRACT.claimable(
        account,
        address,
      );
      return {address: isClaimable};
    }),
  );

  console.log('-res-');
  console.log(res);

  return res;
};
