import {DEPLOYED} from 'constants/index';
import {useContract} from 'hooks/useContract';

import * as publicSale from 'services/abis/PublicSale.json';

type ContractTypes = 'PUBLIC_SALE';

export const useCallContract = (
  contractType: ContractTypes,
  needSigner?: boolean,
) => {
  const {PublicSale_ADDRESS} = DEPLOYED;

  const PublicSale_CONTRACT = useContract(PublicSale_ADDRESS, publicSale.abi);

  if (contractType === 'PUBLIC_SALE') {
    return PublicSale_CONTRACT;
  }
};
