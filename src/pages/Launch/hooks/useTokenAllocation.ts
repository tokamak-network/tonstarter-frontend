import {Projects, VaultCommon} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import commafy from 'utils/commafy';

const useTokenAllocation = () => {
  const [remaindToken, setRemaindToken] = useState<string | number>('-');
  const {values} = useFormikContext<Projects['CreateProject']>();
  const {totalSupply, vaults} = values;
  useEffect(() => {
    const totalTokenAllocation = vaults.reduce((acc, vault: VaultCommon) => {
      return acc + Number(vault.vaultTokenAllocation);
    }, 0);
    if (totalSupply) {
      const remaindTokenAmount = Number(totalSupply) - totalTokenAllocation;
      const commaRemaindTokenAmount = commafy(remaindTokenAmount);
      if (commaRemaindTokenAmount) setRemaindToken(commaRemaindTokenAmount);
    }
  }, [values, totalSupply, vaults]);
  return {remaindToken, totalSupply: commafy(totalSupply)};
};

export default useTokenAllocation;
