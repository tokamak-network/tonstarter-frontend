import {useEffect, useState} from 'react';
import {useERC20} from '@Starter/hooks/useERC20';

const useValueCheck = (SALE_CONTRACT: string, inputBalance?: string) => {
  const [valueCheck, setValueCheck] = useState<{
    isTonAllowanceZero: boolean;
    isWtonAllowanceZero: boolean;
    isInputTonMore?: boolean;
    isInputWtonMore?: boolean;
  }>({
    isTonAllowanceZero: true,
    isWtonAllowanceZero: true,
    isInputTonMore: true,
    isInputWtonMore: true,
  });

  const {tonAllowance, wtonAllowance} = useERC20(SALE_CONTRACT);

  useEffect(() => {
    const numTonAllowance = Number(tonAllowance.replaceAll(',', ''));
    const numWtonAllowance = Number(wtonAllowance.replaceAll(',', ''));
    const isTonAllowanceZero = numTonAllowance <= 0;
    const isWtonAllowanceZero = numWtonAllowance <= 0;
    const isInputTonMore =
      Number(inputBalance?.replaceAll(',', '') || '0.00') > numTonAllowance;
    const isInputWtonMore =
      Number(inputBalance?.replaceAll(',', '') || '0.00') > numWtonAllowance;
    return setValueCheck({
      isTonAllowanceZero,
      isWtonAllowanceZero,
      isInputTonMore,
      isInputWtonMore,
    });
  }, [tonAllowance, wtonAllowance, SALE_CONTRACT, inputBalance]);

  return valueCheck;
};

export default useValueCheck;
