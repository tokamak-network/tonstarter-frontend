import {selectLaunch} from '@Launch/launch.reducer';
import {VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect, useState} from 'react';

function useVaultSelector(): {
  selectedVaultDetail: VaultAny | undefined;
} {
  const [selectedVaultDetail, setSelectedVaultDetail] = useState<
    VaultAny | undefined
  >(undefined);
  const {values} = useFormikContext();
  //@ts-ignore
  const vaultsList = values.vaults;
  const {
    data: {selectedVault},
  } = useAppSelector(selectLaunch);

  useEffect(() => {
    vaultsList.filter((vaultData: VaultAny) => {
      if (vaultData.vaultName === selectedVault) {
        return setSelectedVaultDetail(vaultData);
      }
      return undefined;
    });
  }, [selectedVault, vaultsList]);

  return {selectedVaultDetail: selectedVaultDetail};
}

export default useVaultSelector;
