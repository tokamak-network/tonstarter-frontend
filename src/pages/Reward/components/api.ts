import axios from 'axios';
import {API_SERVER, DEFAULT_NETWORK} from '../../../constants/index';

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

function createInstance() {
  return axios.create({
    baseURL: API_SERVER,
  });
}

const instance = createInstance();

export async function createReward(args: CreateReward) {
  const {
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

export async function createToken(tokenAddress: string, tokenImage: string) {
  const res = await instance.post(`/tokens?chainId=${DEFAULT_NETWORK}`, {
    tokenAddress,
    tokenImage,
  });

  return res.data;
}

export async function editToken(tokenAddress:string, tokenImage: string) {
  const res = await instance.put(`/tokens?chainId=${DEFAULT_NETWORK}`, {
    tokenAddress,
    tokenImage,
  })
  
}

export async function getRandomKey(from: string) {
  const res = await instance.post('/randomkey', {
    account: from,
  });
  return res.data.data.randomvalue;
}
