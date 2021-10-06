import {useContract} from 'hooks/useContract';
import * as publicSale from 'services/abis/PublicSale.json';

type ContractType = 'PUBLIC_SALE';

export const useCallContract = (
  address: string,
  contractType: ContractType,
  needSigner?: boolean,
) => {
  const abi = contractType === 'PUBLIC_SALE' ? publicSale.abi : '';
  const PublicSale_CONTRACT = useContract(address, abi);

  return PublicSale_CONTRACT;
};
