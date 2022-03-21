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
            percent: (publicRound1Allocation * 100) / vaultTokenAllocation || 0,
            formikName: 'publicRound1Allocation',
          },
          {
            title: 'Public Round 2',
            content: `${publicRound2Allocation} TON`,
            percent: (publicRound2Allocation * 100) / vaultTokenAllocation || 0,
            formikName: 'publicRound2Allocation',
          },
          {
            title: 'Token Allocation for Liquidity Pool',
            content: `${tokenAllocationForLiquidity} TON`,
            percent:
              (tokenAllocationForLiquidity * 100) / vaultTokenAllocation || 0,
            formikName: 'tokenAllocationForLiquidity',
          },
          {
            title: 'Hard Cap',
            content: `${hardCap} TON`,
            formikName: 'hardCap',
          },
          {
            title: 'Address for receiving funds',
            content: addressForReceiving,
            formikName: 'addressForReceiving',
          },
        ],
        secondColData: [
          {
            title: 'Snapshot',
            content: moment.unix(snapshot).format('YYYY.MM.DD hh:mm:ss'),
            formikName: 'snapshot',
          },
          {
            title: 'Whitelist',
            content: `${moment.unix(whitelist).format('YYYY.MM.DD hh:mm:ss')}
              ~${moment.unix(whitelistEnd).format('MM.DD hh:mm:ss')}`,
            formikName: 'whitelist&whitelistEnd',
          },
          {
            title: 'Public Round 1',
            content: `${moment.unix(publicRound1).format('YYYY.MM.DD hh:mm:ss')}
              ~${moment.unix(publicRound1End).format('MM.DD hh:mm:ss')}`,
            formikName: 'publicRound1&publicRound1End',
          },
          {
            title: 'Public Round 2',
            content: `${moment.unix(publicRound2).format('YYYY.MM.DD hh:mm:ss')}
              ~${moment.unix(publicRound2End).format('MM.DD hh:mm:ss')}`,
            formikName: 'publicRound2&publicRound2End',
          },
        ],
        thirdColData: [
          {
            tier: '1',
            requiredTos: oneTier.requiredStos,
            allocatedToken: oneTier.allocatedToken,
            formikName: 'oneTier',
          },
          {
            tier: '2',
            requiredTos: twoTier.requiredStos,
            allocatedToken: twoTier.allocatedToken,
            formikName: 'twoTier',
          },
          {
            tier: '3',
            requiredTos: threeTier.requiredStos,
            allocatedToken: threeTier.allocatedToken,
            formikName: 'threeTier',
          },
          {
            tier: '4',
            requiredTos: fourTier.requiredStos,
            allocatedToken: fourTier.allocatedToken,
            formikName: 'fourTier',
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
