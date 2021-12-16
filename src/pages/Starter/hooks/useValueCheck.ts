import {useEffect, useState} from 'react';
import {useERC20} from '@Starter/hooks/useERC20';

const useValueCheck = (SALE_CONTRACT: string) => {
  const [valueCheck, setValueCheck] = useState<{
    isTonAllowanceZero: boolean;
    isWtonAllowanceZero: boolean;
  }>({
    isTonAllowanceZero: true,
    isWtonAllowanceZero: true,
  });

  const {tonAllowance, wtonAllowance} = useERC20(SALE_CONTRACT);

  useEffect(() => {
    const isTonAllowanceZero = Number(tonAllowance.replaceAll(',', '')) <= 0;
    const isWtonAllowanceZero = Number(wtonAllowance.replaceAll(',', '')) <= 0;

    return setValueCheck({isTonAllowanceZero, isWtonAllowanceZero});
  }, [tonAllowance, wtonAllowance, SALE_CONTRACT]);

  return valueCheck;
};

export default useValueCheck;
