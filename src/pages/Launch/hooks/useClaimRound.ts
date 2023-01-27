import {selectLaunch} from '@Launch/launch.reducer';
import {Projects, VaultSchedule} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect, useState} from 'react';
import truncNumber from 'utils/truncNumber';
import commafy from 'utils/commafy';
import {Decimal} from 'decimal.js';

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
          const decimalPrev = new Decimal(prev);

          if (cur.claimTokenAllocation) {
            const decimalSum = decimalPrev.plus(cur.claimTokenAllocation);
            return Number(commafy(decimalSum.toString()).replaceAll(',', ''));
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
