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
      return vault.vaultType === 'Public';
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
        stosTier,
      } = publicVault[0] as VaultPublic;

      const datas: PublicTokenColData = {
        firstColData: [
          {
            title: 'Public Round 1',
            content: `${publicRound1Allocation}`,
            percent:
              publicRound1Allocation === undefined
                ? publicRound1Allocation
                : (publicRound1Allocation * 100) / vaultTokenAllocation || 0,
            formikName: 'publicRound1Allocation',
          },
          {
            title: 'Public Round 2',
            content: `${publicRound2Allocation}`,
            percent:
              publicRound2Allocation === undefined
                ? publicRound2Allocation
                : (publicRound2Allocation * 100) / vaultTokenAllocation || 0,
            formikName: 'publicRound2Allocation',
          },
          {
            title: 'Token Allocation for Liquidity Pool (5~10%)',
            content: `${tokenAllocationForLiquidity}`,
            formikName: 'tokenAllocationForLiquidity',
          },
          {
            title: 'Hard Cap',
            content: `${hardCap}`,
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
            content:
              snapshot === undefined
                ? '-'
                : moment.unix(snapshot).format('YYYY.MM.DD HH:mm:ss'),
            formikName: 'snapshot',
          },
          {
            title: 'Whitelist',
            content:
              whitelist === undefined || whitelistEnd === undefined
                ? `- ~ -`
                : `${moment.unix(whitelist).format('YYYY.MM.DD HH:mm:ss')}
              ~${moment.unix(whitelistEnd).format('MM.DD HH:mm:ss')}`,
            formikName: 'whitelist&whitelistEnd',
          },
          {
            title: 'Public Round 1',
            content:
              publicRound1 === undefined || publicRound1End === undefined
                ? `- ~ -`
                : `${moment.unix(publicRound1).format('YYYY.MM.DD HH:mm:ss')}
              ~${moment.unix(publicRound1End).format('MM.DD HH:mm:ss')}`,
            formikName: 'publicRound1&publicRound1End',
          },
          {
            title: 'Public Round 2',
            content:
              publicRound2 === undefined || publicRound2End === undefined
                ? `- ~ -`
                : `${moment.unix(publicRound2).format('YYYY.MM.DD HH:mm:ss')}
              ~${moment.unix(publicRound2End).format('MM.DD HH:mm:ss')}`,
            formikName: 'publicRound2&publicRound2End',
          },
        ],
        thirdColData: [
          {
            tier: '1',
            requiredTos: stosTier?.oneTier?.requiredStos,
            allocatedToken: stosTier?.oneTier?.allocatedToken,
            formikName: 'oneTier',
          },
          {
            tier: '2',
            requiredTos: stosTier?.twoTier?.requiredStos,
            allocatedToken: stosTier?.twoTier?.allocatedToken,
            formikName: 'twoTier',
          },
          {
            tier: '3',
            requiredTos: stosTier?.threeTier?.requiredStos,
            allocatedToken: stosTier?.threeTier?.allocatedToken,
            formikName: 'threeTier',
          },
          {
            tier: '4',
            requiredTos: stosTier?.fourTier?.requiredStos,
            allocatedToken: stosTier?.fourTier?.allocatedToken,
            formikName: 'fourTier',
          },
        ],
      };
      //@ts-ignore
      setPublicVaultValue(datas);
    }
  }, [values, vaults]);

  return {publicTokenColData};
};

export default useTokenDetail;
