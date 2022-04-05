import {selectLaunch} from '@Launch/launch.reducer';
import {Projects, Vault, VaultAny, VaultName, VaultPublic} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect, useState} from 'react';

function useVaultSelector(): {
  selectedVaultName: VaultName;
  selectedVaultDetail: VaultAny | VaultPublic | undefined;
} {
  const [selectedVaultDetail, setSelectedVaultDetail] = useState<
    VaultAny | VaultPublic | undefined
  >(undefined);
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  const {
    data: {selectedVault},
  } = useAppSelector(selectLaunch);

  useEffect(() => {
    vaultsList.filter((vaultData: VaultAny) => {
      if (vaultData.vaultName === selectedVault) {
        return setSelectedVaultDetail(vaultData);
      }
    });
  }, [selectedVault, vaultsList, values]);

  return {
    selectedVaultName: selectedVault,
    selectedVaultDetail: selectedVaultDetail,
  };
}

export default useVaultSelector;
