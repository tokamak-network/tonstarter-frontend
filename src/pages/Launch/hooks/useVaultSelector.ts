import {selectLaunch} from '@Launch/launch.reducer';
import {Projects, VaultCommon, VaultName, VaultPublic} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect, useState} from 'react';

function useVaultSelector(): {
  selectedVaultName: VaultName;
  selectedVaultDetail: VaultCommon | VaultPublic | undefined;
} {
  const [selectedVaultDetail, setSelectedVaultDetail] = useState<
    VaultCommon | VaultPublic | undefined
  >(undefined);
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  const {
    data: {selectedVault},
  } = useAppSelector(selectLaunch);

  useEffect(() => {
    vaultsList.filter((vaultData: VaultCommon) => {
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
