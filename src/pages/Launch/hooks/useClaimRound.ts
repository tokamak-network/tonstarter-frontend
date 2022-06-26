import {selectLaunch} from '@Launch/launch.reducer';
import {Projects, VaultSchedule} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect, useState} from 'react';

type ClaimRoundInfo = {
  totalClaimAmount: number | undefined;
};

const useClaimRound = () => {
  const [claimroundInfo, setClaimRoundInfo] = useState<ClaimRoundInfo>({
    totalClaimAmount: undefined,
  });
  const {values} = useFormikContext<Projects['CreateProject']>();

  const {
    data: {selectedVaultIndex, claimRoundTable},
  } = useAppSelector(selectLaunch);
  const vaultsList = values.vaults;

  useEffect(() => {
    if (selectedVaultIndex && claimRoundTable) {
      console.log('go?');
      const totalClaimAmount = claimRoundTable.reduce(
        (prev: number, cur: any) => {
          if (cur.claimTokenAllocation) {
            return prev + cur.claimTokenAllocation;
          }
        },
        0,
      );
      setClaimRoundInfo({totalClaimAmount});
    }
  }, [vaultsList, selectedVaultIndex, claimRoundTable]);

  console.log('hook result');
  console.log(claimroundInfo);

  return claimroundInfo;
};

export default useClaimRound;
