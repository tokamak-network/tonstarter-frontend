import {DEFAULT_NETWORK} from 'constants/index';
import {instance} from './api';

type CreateReward = {
  poolName: string;
  poolAddress: string;
  rewardToken: string;
  account: string;
  incentiveKey: object;
  startTime: number;
  endTime: number;
  allocatedReward: string;
  numStakers: number;
  status: string;
  verified: boolean;
  tx: string;
  sig: string;
};

export async function createReward(args: CreateReward) {
  let {
    poolName,
    poolAddress,
    rewardToken,
    account,
    incentiveKey,
    startTime,
    endTime,
    allocatedReward,
    numStakers,
    status,
    verified,
    tx,
    sig,
  } = args;

  const res = await instance.post(`/reward?chainId=${DEFAULT_NETWORK}`, {
    // chainId: DEFAULT_NETWORK,
    poolName: poolName,
    poolAddress: poolAddress,
    rewardToken: rewardToken,
    account: account,
    incentiveKey: incentiveKey,
    startTime: startTime,
    endTime: endTime,
    allocatedReward: allocatedReward,
    numStakers: numStakers,
    status: status,
    verified: verified,
    tx: tx,
    sig: sig,
  });

  return res.data;
}

export async function getRandomKey(from: string) {
  const res = await instance.post('/randomkey', {
    account: from,
  });
  return res.data.data.randomvalue;
}
