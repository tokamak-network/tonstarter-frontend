import {useEffect, useState} from 'react';

type UseMaxWTONValue = {
  wtonBalance: string;
  amountAvailable: string;
  tokenExRatio: number;
};

const useMaxWTONVaule = (args: UseMaxWTONValue): {maxWTONValue: number} => {
  const {wtonBalance, amountAvailable, tokenExRatio} = args;
  const [maxWTONValue, setMaxValue] = useState<number>(0);

  useEffect(() => {
    if (amountAvailable === '-') {
      return;
    }
    const tokenSumBalance =
      Number(wtonBalance.replaceAll(',', ''));
    const availableProjectTokenBalance =
      Number(amountAvailable.replaceAll(',', '')) / tokenExRatio;
    const maxWTONValue =
      tokenSumBalance <= availableProjectTokenBalance
        ? tokenSumBalance
        : availableProjectTokenBalance;
    return setMaxValue(maxWTONValue);
  }, [wtonBalance, amountAvailable, tokenExRatio]);

  return {maxWTONValue};
};

export default useMaxWTONVaule;
