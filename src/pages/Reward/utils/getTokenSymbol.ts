import { getSigner } from 'utils/contract';
import { Contract } from '@ethersproject/contracts';
import * as TOSABI from 'services/abis/TOS.json';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const getTokenSymbol = async (address: string, library: any) => {
    if ( library === undefined) {
        return;
      }
      if (address === ZERO_ADDRESS) {
        const symbolContract = 'ETH';
        return symbolContract;
      }

      else {
        const contract = new Contract(address, TOSABI.abi, library);
        const symbolContract = await contract.symbol(); 
        return symbolContract;   
      }

       
    
}
