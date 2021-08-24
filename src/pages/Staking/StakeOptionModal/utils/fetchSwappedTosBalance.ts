import {DEPLOYED} from 'constants/index';
import * as TOSABI from 'services/abis/TOS.json';
import {convertNumber} from 'utils/number';
import {Contract} from '@ethersproject/contracts';

export async function fetchSwappedTosBalance (contractAddress: string, library: any):Promise<string> {
  const {TOS_ADDRESS} = DEPLOYED;
   const TOSContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
    const swappedBalance = await TOSContract.balanceOf(contractAddress);
    const convertedNum = convertNumber({amount: swappedBalance});
    if(convertedNum === undefined) {
        return '0.00'
    }
    return convertedNum;
    
}