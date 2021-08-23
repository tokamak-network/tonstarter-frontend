import {useState} from 'react';
import Web3 from 'web3';

export function useBlockNumber(): {blockNumber: number} {
  const [blockNumber, setBlockNumber] = useState(0);

  //@ts-ignore
  const web3 = new Web3(window.ethereum);
  web3.eth
    .subscribe('newBlockHeaders', function (error, result) {
      if (!error) {
        const {number} = result;
        setBlockNumber(number);
        return;
      }

      console.error(error);
    })
    // .on('connected', function (subscriptionId) {
    //   console.log(subscriptionId);
    // })
    // .on('data', function (blockHeader) {
    //   console.log(blockHeader);
    // })
    .on('error', console.error);

  return {blockNumber};
}
