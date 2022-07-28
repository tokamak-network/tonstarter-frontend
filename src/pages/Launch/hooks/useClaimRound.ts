import {selectLaunch} from '@Launch/launch.reducer';
import {Projects, VaultSchedule} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect, useState} from 'react';
import truncNumber from 'utils/truncNumber';

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
    if (selectedVaultIndex !== undefined && claimRoundTable !== undefined) {
      const totalClaimAmount = claimRoundTable.reduce(
        (prev: number, cur: any) => {
          if (cur.claimTokenAllocation) {
            const num: any = truncNumber(cur.claimTokenAllocation as number, 2);
            const result: any = truncNumber(prev, 2) + num;
            return truncNumber(result, 2) as any;
          }
          return 0;
        },
        0,
      );
      setClaimRoundInfo({
        totalClaimAmount:
          vaultsList[selectedVaultIndex]?.vaultTokenAllocation -
          totalClaimAmount,
      });
    }
  }, [vaultsList, selectedVaultIndex, claimRoundTable]);

  return claimroundInfo;
};

export default useClaimRound;
