import {useEffect, useState} from 'react';

type UseMaxValue = {
  tonBalance: string;
  wtonBalance: string;
  amountAvailable: string;
  tokenExRatio: number;
};

const useMaxValue = (args: UseMaxValue): {maxValue: number} => {
  const {tonBalance, wtonBalance, amountAvailable, tokenExRatio} = args;
  const [maxValue, setMaxValue] = useState<number>(0);

  useEffect(() => {
    if (amountAvailable === '-') {
      return;
    }
    const tokenSumBalance =
      Number(tonBalance.replaceAll(',', '')) +
      Number(wtonBalance.replaceAll(',', ''));
    const availableProjectTokenBalance =
      Number(amountAvailable.replaceAll(',', '')) / tokenExRatio;
    const maxValue =
      tokenSumBalance <= availableProjectTokenBalance
        ? tokenSumBalance
        : availableProjectTokenBalance;
    return setMaxValue(maxValue);
  }, [tonBalance, wtonBalance, amountAvailable, tokenExRatio]);

  return {maxValue};
};

export default useMaxValue;
