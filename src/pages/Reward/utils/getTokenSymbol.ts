import { getSigner } from 'utils/contract';
import { Contract } from '@ethersproject/contracts';
import * as TOSABI from 'services/abis/TOS.json';


export const getTokenSymbol = async (address: string, library: any, userAddress: string | null | undefined) => {
    if (userAddress === null || userAddress === undefined || library === undefined) {
        return;
      }
      const signer = getSigner(library, userAddress);
      const contract = new Contract(address, TOSABI.abi, library);
      const symbolContract = await contract.connect(signer).symbol();
    return symbolContract;
}
