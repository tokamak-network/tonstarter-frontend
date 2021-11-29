import { getSigner } from 'utils/contract';
import { Contract } from '@ethersproject/contracts';
import * as TOSABI from 'services/abis/TOS.json';


export const getTokenSymbol = async (address: string, library: any) => {
    if ( library === undefined) {
        return;
      }
      const contract = new Contract(address, TOSABI.abi, library);
      const symbolContract = await contract.symbol();      
    return symbolContract;
}
