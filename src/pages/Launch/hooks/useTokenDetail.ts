import {
  Projects,
  PublicTokenColData,
  VaultCommon,
  VaultPublic,
} from '@Launch/types';
import {useFormikContext} from 'formik';
import moment from 'moment';
import {useEffect, useState} from 'react';

const useTokenDetail = () => {
  const {values} = useFormikContext<Projects['CreateProject']>();
  const {vaults} = values;

  const [publicTokenColData, setPublicVaultValue] =
    useState<PublicTokenColData>();

  useEffect(() => {
    const publicVault = vaults.filter((vault: VaultCommon) => {
      return vault.vaultName === 'Public';
    });
    if (publicVault[0] as VaultPublic) {
      const {
        publicRound1,
        publicRound2,
        tokenAllocationForLiquidity,
        hardCap,
        addressForReceiving,
        snapshot,
        whitelist,
        whitelistEnd,
        publicRound1Allocation,
        publicRound1End,
        publicRound2Allocation,
        publicRound2End,
        vaultTokenAllocation,
        stosTier: {oneTier, twoTier, threeTier, fourTier},
      } = publicVault[0] as VaultPublic;
      const datas: PublicTokenColData = {
        firstColData: [
          {
            title: 'Public Round 1',
            content: `${publicRound1Allocation} TON`,
            percent: publicRound1Allocation / vaultTokenAllocation || 0,
          },
          {
            title: 'Public Round 2',
            content: `${publicRound2Allocation} TON`,
            percent: publicRound2Allocation / vaultTokenAllocation || 0,
          },
          {
            title: 'Token Allocation for Liquidity Pool',
            content: `${tokenAllocationForLiquidity} TON`,
            percent: tokenAllocationForLiquidity / vaultTokenAllocation || 0,
          },
          {
            title: 'Hard Cap',
            content: `${hardCap} TON`,
          },
          {
            title: 'Address for receiving funds',
            content: addressForReceiving,
          },
        ],
        secondColData: [
          {
            title: 'Snapshot',
            content: moment.unix(snapshot).format('YYYY.MM.DD hh:mm:ss'),
          },
          {
            title: 'Whitelist',
            content: `${moment.unix(whitelist).format('YYYY.MM.DD hh:mm:ss')}
              ~${moment.unix(whitelistEnd).format('MM.DD hh:mm:ss')}`,
          },
          {
            title: 'Public Round 1',
            content: `${moment.unix(publicRound1).format('YYYY.MM.DD hh:mm:ss')}
              ~${moment.unix(publicRound1End).format('MM.DD hh:mm:ss')}`,
          },
          {
            title: 'Public Round 2',
            content: `${moment.unix(publicRound2).format('YYYY.MM.DD hh:mm:ss')}
              ~${moment.unix(publicRound2End).format('MM.DD hh:mm:ss')}`,
          },
        ],
        thirdColData: [
          {
            tier: '1',
            requiredTos: oneTier.requiredStos,
            allocatedToken: oneTier.allocatedToken,
          },
          {
            tier: '2',
            requiredTos: twoTier.requiredStos,
            allocatedToken: twoTier.allocatedToken,
          },
          {
            tier: '3',
            requiredTos: threeTier.requiredStos,
            allocatedToken: threeTier.allocatedToken,
          },
          {
            tier: '4',
            requiredTos: fourTier.requiredStos,
            allocatedToken: fourTier.allocatedToken,
          },
        ],
      };
      //@ts-ignore
      setPublicVaultValue(datas);
    }
  }, [vaults]);

  return {publicTokenColData};
};

export default useTokenDetail;
