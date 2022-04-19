import {useEffect, useState} from 'react';

type UseMaxValue = {
  tonBalance: string;
  amountAvailable: string;
  tokenExRatio: number;
};

const useMaxValue = (args: UseMaxValue): {maxValue: number} => {
  const {tonBalance, amountAvailable, tokenExRatio} = args;
  const [maxValue, setMaxValue] = useState<number>(0);

  useEffect(() => {
    if (amountAvailable === '-') {
      return;
    }
    const tokenSumBalance = Number(tonBalance.replaceAll(',', ''));
    const availableProjectTokenBalance =
      Number(amountAvailable.replaceAll(',', '')) / tokenExRatio;
    const maxValue =
      tokenSumBalance <= availableProjectTokenBalance
        ? tokenSumBalance
        : availableProjectTokenBalance;

    // const x = Math.floor(maxValue * 1000) / 1000;

    return setMaxValue(maxValue);
    // return setMaxValue(maxValue)
  }, [tonBalance, amountAvailable, tokenExRatio]);

  return {maxValue};
};

export default useMaxValue;
