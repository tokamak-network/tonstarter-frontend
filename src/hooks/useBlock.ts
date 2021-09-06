import {useEffect, useState} from 'react';
import Web3 from 'web3';

export function useBlockNumber(): {blockNumber: number} {
  const [blockNumber, setBlockNumber] = useState(0);
  const [BN, setBN] = useState(0);

  const web3 = new Web3((window as any).ethereum);
  // const currentBlockNumber = web3.eth.getBlockNumber();
  // currentBlockNumber.then((e) => setBlockNumber(e));

  web3.eth
    .subscribe('newBlockHeaders', function (error, result) {
      if (!error) {
        // const {number} = result;
        // setBN(number);

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

  useEffect(() => {
    setBlockNumber(BN);
  }, [BN]);

  return {blockNumber};
}
