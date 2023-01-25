import {selectLaunch} from '@Launch/launch.reducer';
import {Projects, VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect, useState} from 'react';

function useSelectVault() {
  const {
    data: {
      selectedVault,
      claimRoundTable,
      tempVaultData,
      selectedVaultIndex,
      uncompletedVaultIndex,
      alreadySelected,
    },
  } = useAppSelector(selectLaunch);
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const [selectedVaultDetail, setSelectedVaultDetail] = useState([]);
  const vaultsList = values.vaults;

  useEffect(() => {
    vaultsList.filter((vaultData: VaultAny) => {
      if (vaultData.vaultName === selectedVault) {
        //@ts-ignore
        return setSelectedVaultDetail(vaultData);
      }
    });
  }, [selectedVault, vaultsList]);

  return {selectedVaultDetail, selectedVaultIndex};
}

export default useSelectVault;
